import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

  try {
    // Rate limiting check
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const clientIP = getClientIP(req);
    const { data: rateLimitOk } = await supabaseService.rpc('check_edge_function_rate_limit', {
      identifier_param: clientIP,
      function_name_param: 'generate-discount-code',
      max_requests: 3,
      window_minutes: 60
    });

    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429,
        }
      );
    }

    const body = await req.json();
    const { email } = body;
    
    // Input validation
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Validate email format using database function
    const { data: emailValid } = await supabaseService.rpc('validate_email_format', {
      email: email
    });

    if (!emailValid) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create a one-time 10% discount coupon
    const coupon = await stripe.coupons.create({
      percent_off: 10,
      duration: "once",
      max_redemptions: 1,
      metadata: {
        email: email,
        created_for: "email_capture_popup"
      }
    });

    console.log(`Generated discount code ${coupon.id} for email: ${email}`);

    return new Response(
      JSON.stringify({ 
        coupon_id: coupon.id,
        discount_percent: coupon.percent_off 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error generating discount code:", error);
    
    // Log security event
    try {
      await supabaseService.rpc('log_security_event', {
        event_type: 'discount_code_generation_error',
        details: { 
          function: 'generate-discount-code',
          client_ip: clientIP,
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log security event:', logError);
    }

    return new Response(
      JSON.stringify({ error: "An error occurred generating discount code" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});