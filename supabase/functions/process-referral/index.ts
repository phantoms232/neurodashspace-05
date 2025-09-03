import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
      function_name_param: 'process-referral',
      max_requests: 5,
      window_minutes: 10
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
    const { referral_code, user_email } = body;

    // Comprehensive input validation
    if (!referral_code || typeof referral_code !== 'string') {
      return new Response(
        JSON.stringify({ error: "Invalid referral code format" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!user_email || typeof user_email !== 'string') {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Validate email format using database function
    const { data: emailValid } = await supabaseService.rpc('validate_email_format', {
      email: user_email
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

    // Validate referral code format using existing function
    const { data: referralCodeValid } = await supabaseService.rpc('validate_referral_code', {
      code: referral_code
    });

    if (!referralCodeValid) {
      return new Response(
        JSON.stringify({ error: "Invalid referral code format" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Validation already done above, proceed with business logic

    // Grant free trial using the database function
    const { data, error } = await supabaseService.rpc('grant_free_trial', {
      user_email,
      referral_code_used: referral_code
    });

    if (error) throw error;

    if (!data) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Invalid or already used referral code" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "1 week premium trial activated!" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    // Log security event
    try {
      await supabaseService.rpc('log_security_event', {
        event_type: 'referral_processing_error',
        details: { 
          function: 'process-referral',
          client_ip: clientIP,
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log security event:', logError);
    }

    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});