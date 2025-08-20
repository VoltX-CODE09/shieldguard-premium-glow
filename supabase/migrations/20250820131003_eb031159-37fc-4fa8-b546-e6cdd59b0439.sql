-- Fix security vulnerability: Restrict UPDATE access to own records only
-- Current policy allows any authenticated user to update any subscription record

-- Drop the current overly permissive update policy
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create a secure update policy that only allows users to update their own records
CREATE POLICY "authenticated_users_can_update_own_subscription" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (
  -- Users can only update records that belong to them
  (user_id = auth.uid() AND email = auth.email())
  OR 
  -- Allow service role (for edge functions) to manage any subscriptions
  auth.jwt()->>'role' = 'service_role'
);

-- Additional security: Ensure users cannot change critical fields to other users' data
-- Create a more restrictive policy that prevents users from changing user_id or email to other values
CREATE POLICY "prevent_subscription_hijacking"
ON public.subscribers
FOR UPDATE
TO authenticated
WITH CHECK (
  -- Prevent users from changing user_id or email to values that don't belong to them
  (user_id = auth.uid() AND email = auth.email())
  OR
  -- Allow service role to manage any changes (for legitimate subscription updates)
  auth.jwt()->>'role' = 'service_role'
);