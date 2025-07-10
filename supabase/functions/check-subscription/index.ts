
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  console.log("=== CHECK-SUBSCRIPTION FUNCTION STARTED ===");
  
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  // Use the service role key to perform writes (upsert) in Supabase
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    console.log("=== CHECKING STRIPE KEY ===");
    // Get the Stripe secret key from environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    console.log("STRIPE_SECRET_KEY found:", !!stripeKey);
    
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not found!");
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    logStep("Stripe key verified");

    console.log("=== CHECKING AUTHENTICATION ===");
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    console.log("=== INITIALIZING STRIPE ===");
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    console.log("Stripe initialized successfully");
    
    console.log("=== CHECKING FOR STRIPE CUSTOMER ===");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    console.log("Customer search result:", customers.data.length, "customers found");
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    console.log("=== CHECKING SUBSCRIPTIONS ===");
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    console.log("Active subscriptions found:", subscriptions.data.length);
    
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      // Determine subscription tier from price
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      if (amount <= 999) {
        subscriptionTier = "Basic";
      } else if (amount <= 1999) {
        subscriptionTier = "Premium";
      } else {
        subscriptionTier = "Enterprise";
      }
      logStep("Determined subscription tier", { priceId, amount, subscriptionTier });
    } else {
      logStep("No active subscription found");
    }

    console.log("=== UPDATING DATABASE ===");
    const upsertResult = await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });
    
    console.log("Database update result:", upsertResult);

    logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('=== CHECK-SUBSCRIPTION ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', errorMessage);
    console.error('Error stack:', error.stack);
    logStep("ERROR in check-subscription", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error.stack 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
