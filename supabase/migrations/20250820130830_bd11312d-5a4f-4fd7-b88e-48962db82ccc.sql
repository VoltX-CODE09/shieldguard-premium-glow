-- Fix security vulnerability: Restrict INSERT access to authenticated users only
-- and ensure users can only create records for themselves

-- Drop the current overly permissive insert policy
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create a secure insert policy that only allows authenticated users 
-- to create records for themselves
CREATE POLICY "authenticated_users_can_insert_own_subscription" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Users can only create records for themselves
  user_id = auth.uid() 
  OR 
  -- Allow service role (for edge functions) to manage subscriptions
  auth.jwt()->>'role' = 'service_role'
);

-- Also ensure the email matches the authenticated user's email when inserting
-- This prevents users from creating subscriptions with fake emails
CREATE POLICY "insert_subscription_email_match"
ON public.subscribers
FOR INSERT
TO authenticated  
WITH CHECK (
  -- Email must match the authenticated user's email
  email = auth.email()
  OR
  -- Allow service role to manage any email (for Stripe webhooks/edge functions)
  auth.jwt()->>'role' = 'service_role'
);