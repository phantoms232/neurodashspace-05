import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use regular Supabase client for proper JWT validation
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" }
        }
      }
    );

    // Verify JWT and get user info securely
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log("Authentication failed:", authError?.message);
      throw new Error("Invalid authentication token");
    }

    const userId = user.id;
    console.log("User authenticated successfully:", userId);

    // Use service role for database operations that bypass RLS
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if user already has a referral code
    const { data: existingReferral } = await supabaseService
      .from('referrals')
      .select('referral_code')
      .eq('referrer_user_id', userId)
      .maybeSingle();

    if (existingReferral) {
      return new Response(
        JSON.stringify({ 
          referral_code: existingReferral.referral_code,
          referral_url: `${req.headers.get("origin")}/auth?ref=${existingReferral.referral_code}`
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Generate new referral code using database function
    const { data: referralCode, error } = await supabaseService.rpc('generate_referral_code', {
      user_id: userId
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        referral_code: referralCode,
        referral_url: `${req.headers.get("origin")}/auth?ref=${referralCode}`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});