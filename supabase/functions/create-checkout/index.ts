
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("=== CREATE-CHECKOUT FUNCTION STARTED ===");
  
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Request method:", req.method);

  // Create a Supabase client using the anon key
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    console.log("=== CHECKING AUTHENTICATION ===");
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);
    
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Token extracted, length:", token.length);
    
    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    console.log("Auth response error:", authError);
    
    const user = data.user;
    if (!user?.email) {
      console.log("User authentication failed - no user or email");
      throw new Error("User not authenticated or email not available");
    }
    
    console.log("User authenticated successfully:", user.email);

    console.log("=== CHECKING STRIPE KEY ===");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    console.log("STRIPE_SECRET_KEY found:", !!stripeSecretKey);
    
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not found!");
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }

    console.log("=== INITIALIZING STRIPE ===");
    const stripe = new Stripe(stripeSecretKey, { 
      apiVersion: "2023-10-16" 
    });
    console.log("Stripe initialized successfully");
    
    console.log("=== CHECKING FOR EXISTING CUSTOMER ===");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    console.log("Customer search result:", customers.data.length, "customers found");
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      console.log("No existing customer found");
    }

    console.log("=== CREATING CHECKOUT SESSION ===");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "ShieldGuard Premium Protection" },
            unit_amount: 499, // €4.99 in cents
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/`,
      cancel_url: `${req.headers.get("origin")}/`,
    });

    console.log("Checkout session created successfully:", session.id);
    console.log("Checkout URL:", session.url);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('=== CHECKOUT ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
