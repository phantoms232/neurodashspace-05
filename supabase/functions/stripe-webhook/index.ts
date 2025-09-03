import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use the service role key to bypass RLS for webhook processing
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Webhook started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    logStep("Processing webhook event", { type: event.type, id: event.id });

    // Handle subscription events
    if (event.type.startsWith('customer.subscription.')) {
      const subscription = event.data.object as any;
      const customerId = subscription.customer;

      // Get customer email
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer || customer.deleted) {
        logStep("Customer not found or deleted", { customerId });
        return new Response("Customer not found", { status: 400 });
      }

      const customerEmail = (customer as any).email;
      if (!customerEmail) {
        logStep("Customer email not found", { customerId });
        return new Response("Customer email not found", { status: 400 });
      }

      let subscribed = false;
      let subscriptionTier = null;
      let subscriptionEnd = null;

      if (event.type === 'customer.subscription.created' || 
          event.type === 'customer.subscription.updated') {
        if (subscription.status === 'active' || subscription.status === 'trialing') {
          subscribed = true;
          subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
          
          // Determine tier based on price
          const amount = subscription.items.data[0]?.price?.unit_amount || 0;
          if (amount <= 999) {
            subscriptionTier = "Basic";
          } else if (amount <= 1999) {
            subscriptionTier = "Premium";
          } else {
            subscriptionTier = "Enterprise";
          }
        }
      } else if (event.type === 'customer.subscription.deleted' ||
                 event.type === 'customer.subscription.canceled') {
        subscribed = false;
        subscriptionTier = null;
        subscriptionEnd = null;
      }

      // Update subscriber record
      const { error: updateError } = await supabaseClient
        .from('subscribers')
        .upsert({
          email: customerEmail,
          stripe_customer_id: customerId,
          subscribed,
          subscription_tier: subscriptionTier,
          subscription_end: subscriptionEnd,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });

      if (updateError) {
        logStep("Error updating subscriber", { error: updateError });
        throw updateError;
      }

      logStep("Subscription updated successfully", {
        email: customerEmail,
        subscribed,
        tier: subscriptionTier,
        eventType: event.type
      });

      // Log security event
      await supabaseClient
        .from('security_logs')
        .insert({
          event_type: 'stripe_webhook_processed',
          details: {
            stripe_event_id: event.id,
            stripe_event_type: event.type,
            customer_id: customerId,
            customer_email: customerEmail,
            subscription_status: subscription.status,
            subscribed,
            subscription_tier: subscriptionTier
          }
        });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});