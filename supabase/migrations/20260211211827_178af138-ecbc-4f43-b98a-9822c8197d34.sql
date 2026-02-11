
-- Table to store push notification subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anonymous visitors can subscribe)
CREATE POLICY "Anyone can subscribe to push" 
ON public.push_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Only backend (service role) can read subscriptions for sending
CREATE POLICY "Service role can read subscriptions" 
ON public.push_subscriptions 
FOR SELECT 
USING (false);

-- Allow delete by endpoint match (for unsubscribe)
CREATE POLICY "Anyone can unsubscribe" 
ON public.push_subscriptions 
FOR DELETE 
USING (true);
