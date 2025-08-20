-- Fix critical data exposure vulnerability: Remove email-based access to subscription records
-- Current policy allows access to any subscription record if you know the email address

-- Drop the current policy that allows email-based access
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;

-- Create a secure SELECT policy that ONLY allows access to own records via user_id
CREATE POLICY "authenticated_users_can_select_own_subscription_only" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (
  -- Users can ONLY access records where user_id matches their authenticated ID
  user_id = auth.uid()
  OR 
  -- Allow service role (for edge functions) to access any records for legitimate operations
  auth.jwt()->>'role' = 'service_role'
);

-- Note: Edge functions use service role key and can still access records by email
-- This maintains functionality while preventing unauthorized user access