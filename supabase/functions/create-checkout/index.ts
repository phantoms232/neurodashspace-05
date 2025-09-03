import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Helper function to get client IP
function getClientIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') || 
         req.headers.get('x-forwarded-for') || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client using the anon key
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  // Create service client for rate limiting
  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    // Rate limiting check
    const clientIP = getClientIP(req);
    const { data: rateLimitOk } = await supabaseService.rpc('check_edge_function_rate_limit', {
      identifier_param: clientIP,
      function_name_param: 'create-checkout',
      max_requests: 10,
      window_minutes: 60
    });

    if (!rateLimitOk) {
      logStep("Rate limit exceeded", { client_ip: clientIP });
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429,
        }
      );
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const body = await req.json();
    const { plan, promo_code } = body;

    // Input validation
    if (!plan || typeof plan !== 'string') {
      logStep("Invalid plan provided", { plan });
      return new Response(
        JSON.stringify({ error: "Invalid subscription plan" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const validPlans = ['weekly', 'monthly', 'yearly'];
    if (!validPlans.includes(plan)) {
      logStep("Invalid plan type", { plan, validPlans });
      return new Response(
        JSON.stringify({ error: "Invalid subscription plan" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    if (!plan) throw new Error("Plan is required");
    logStep("Plan received", { plan });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    // Define prices based on plan (matching UI prices exactly)
    const priceData = {
      weekly: { amount: 210, interval: "week" as const },  // $2.10
      monthly: { amount: 795, interval: "month" as const }, // $7.95
      yearly: { amount: 8555, interval: "year" as const }, // $85.55
    };

    const selectedPrice = priceData[plan as keyof typeof priceData];
    if (!selectedPrice) throw new Error("Invalid plan selected");

    logStep("Creating checkout session", { plan, amount: selectedPrice.amount, interval: selectedPrice.interval });

    // Handle optional promotion code
    let promotionCodeId: string | undefined;
    if (promo_code && typeof promo_code === 'string' && promo_code.trim().length > 0) {
      const codeVal = promo_code.trim();
      try {
        const { data: dc } = await supabaseService
          .from('discount_codes')
          .select('promotion_code_id')
          .eq('code', codeVal)
          .limit(1)
          .maybeSingle();
        if (dc?.promotion_code_id) {
          promotionCodeId = dc.promotion_code_id as string;
          logStep('Promo code found in DB', { code: codeVal });
        } else {
          const list = await stripe.promotionCodes.list({ code: codeVal, limit: 1, active: true });
          if (list.data.length > 0) {
            promotionCodeId = list.data[0].id;
            logStep('Promo code found in Stripe', { code: codeVal });
          } else {
            logStep('Promo code not found or inactive', { code: codeVal });
          }
        }
      } catch (e) {
        logStep('Promo lookup error', { message: e instanceof Error ? e.message : String(e) });
      }
    }

    const origin = req.headers.get("origin") || "https://neurodash.space";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: `NeuroDash Premium - ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
              description: "Access to premium cognitive tests and advanced features"
            },
            unit_amount: selectedPrice.amount,
            recurring: { interval: selectedPrice.interval },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      discounts: promotionCodeId ? [{ promotion_code: promotionCodeId }] : undefined,
      allow_promotion_codes: true,
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      // No free trial - direct payment required
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    
    // Log security event
    try {
      await supabaseService.rpc('log_security_event', {
        event_type: 'checkout_creation_error',
        details: { 
          function: 'create-checkout',
          client_ip: getClientIP(req),
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log security event:', logError);
    }

    return new Response(JSON.stringify({ error: "An error occurred creating checkout session" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});