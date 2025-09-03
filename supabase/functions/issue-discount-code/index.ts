import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper: get client IP for rate limiting
function getClientIP(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Helper logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[ISSUE-DISCOUNT-CODE] ${step}${detailsStr}`);
};

// Background task helper (if supported)
// deno-lint-ignore no-explicit-any
const waitUntil = (promise: Promise<any>) => {
  try {
    // @ts-ignore - EdgeRuntime may exist
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(promise);
      return;
    }
  } catch (_e) {}
  // Fallback: fire and forget
  promise.catch((e) => console.error("Background task failed:", e));
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Service client needed for DB writes under RLS
  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const clientIP = getClientIP(req);

    // Rate-limit: 5 per hour per IP
    const { data: rateOk } = await supabaseService.rpc(
      "check_edge_function_rate_limit",
      {
        identifier_param: clientIP,
        function_name_param: "issue-discount-code",
        max_requests: 5,
        window_minutes: 60,
      }
    );
    if (!rateOk) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429 }
      );
    }

    const body = await req.json();
    const { email } = body as { email?: string };

    // Validate email via DB function
    const { data: emailValid } = await supabaseService.rpc(
      "validate_email_format",
      { email }
    );
    if (!emailValid) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Check current available pool size
    const { data: countData, error: countErr } = await supabaseService
      .from("discount_codes")
      .select("id", { count: "exact", head: true })
      .eq("status", "available");
    if (countErr) throw countErr;
    const availableCount = (countData as any)?.length === 0 ? 0 : (countData as any);

    // Try to grab an existing available code
    const { data: existingCode } = await supabaseService
      .from("discount_codes")
      .select("id, code, coupon_id, promotion_code_id")
      .eq("status", "available")
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    let codeToReturn: { code: string; coupon_id: string; promotion_code_id: string } | null = null;

    if (existingCode) {
      // Mark it as issued to this email
      const { error: updErr } = await supabaseService
        .from("discount_codes")
        .update({ status: "issued", issued_to_email: email, issued_at: new Date().toISOString() })
        .eq("id", existingCode.id);
      if (updErr) throw updErr;

      codeToReturn = {
        code: existingCode.code,
        coupon_id: existingCode.coupon_id,
        promotion_code_id: existingCode.promotion_code_id,
      };

      // Top-up pool by 1 in background to keep ~100 available
      if ((availableCount ?? 0) - 1 < 100) {
        logStep("Top-up: creating one new code in background");
        waitUntil((async () => {
          const coupon = await stripe.coupons.create({
            percent_off: 10,
            duration: "once",
            max_redemptions: 1,
            metadata: { created_for: "pool_top_up" },
          });
          const promo = await stripe.promotionCodes.create({ coupon: coupon.id, max_redemptions: 1 });
          await supabaseService.from("discount_codes").insert({
            code: promo.code!,
            coupon_id: coupon.id,
            promotion_code_id: promo.id,
            status: "available",
            source: "pool_top_up",
          });
        })());
      }
    } else {
      // None available -> create one now for this user
      logStep("No available codes; creating one now");
      const coupon = await stripe.coupons.create({
        percent_off: 10,
        duration: "once",
        max_redemptions: 1,
        metadata: { created_for: "on_demand_issue" },
      });
      const promo = await stripe.promotionCodes.create({ coupon: coupon.id, max_redemptions: 1 });

      const { error: insErr } = await supabaseService.from("discount_codes").insert({
        code: promo.code!,
        coupon_id: coupon.id,
        promotion_code_id: promo.id,
        status: "issued",
        issued_to_email: email,
        issued_at: new Date().toISOString(),
        source: "on_demand_issue",
      });
      if (insErr) throw insErr;

      codeToReturn = { code: promo.code!, coupon_id: coupon.id, promotion_code_id: promo.id };

      // If this appears to be first-time setup, seed ~100 in background
      const { data: totalCountData, error: totalErr } = await supabaseService
        .from("discount_codes")
        .select("id", { count: "exact", head: true });
      if (totalErr) throw totalErr;
      const totalApprox = (totalCountData as any)?.length === 0 ? 0 : (totalCountData as any);

      if ((totalApprox ?? 0) < 2) {
        logStep("Seeding 100 codes in background");
        waitUntil((async () => {
          for (let i = 0; i < 100; i++) {
            try {
              const c = await stripe.coupons.create({
                percent_off: 10,
                duration: "once",
                max_redemptions: 1,
                metadata: { created_for: "initial_seed" },
              });
              const p = await stripe.promotionCodes.create({ coupon: c.id, max_redemptions: 1 });
              await supabaseService.from("discount_codes").insert({
                code: p.code!,
                coupon_id: c.id,
                promotion_code_id: p.id,
                status: "available",
                source: "initial_seed",
              });
            } catch (e) {
              console.error("Seed code creation failed", e);
            }
          }
        })());
      } else if ((availableCount ?? 0) < 100) {
        // Otherwise keep topping-up by 1
        waitUntil((async () => {
          const c = await stripe.coupons.create({ percent_off: 10, duration: "once", max_redemptions: 1 });
          const p = await stripe.promotionCodes.create({ coupon: c.id, max_redemptions: 1 });
          await supabaseService.from("discount_codes").insert({
            code: p.code!,
            coupon_id: c.id,
            promotion_code_id: p.id,
            status: "available",
            source: "pool_top_up",
          });
        })());
      }
    }

    logStep("Issued code", { email, code: codeToReturn!.code });

    return new Response(
      JSON.stringify({
        code: codeToReturn!.code,
        coupon_id: codeToReturn!.coupon_id,
        promotion_code_id: codeToReturn!.promotion_code_id,
        discount_percent: 10,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error issuing discount code:", error);

    // Attempt to log security event
    try {
      await supabaseService.rpc("log_security_event", {
        event_type: "issue_discount_code_error",
        details: {
          function: "issue-discount-code",
          client_ip: getClientIP(req),
          timestamp: new Date().toISOString(),
        },
      });
    } catch (logError) {
      console.error("Failed to log security event:", logError);
    }

    return new Response(
      JSON.stringify({ error: "An error occurred issuing discount code" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
