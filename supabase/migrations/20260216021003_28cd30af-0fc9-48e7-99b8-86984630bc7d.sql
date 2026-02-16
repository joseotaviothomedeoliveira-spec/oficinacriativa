
-- Analytics events table
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL, -- 'page_view', 'button_click', 'checkout_click'
  page text NOT NULL, -- '/', '/p/5000-moldes-eva', '/upsell-assistente', '/assistente'
  metadata jsonb DEFAULT '{}',
  session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anonymous tracking)
CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read analytics"
ON public.analytics_events
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast queries
CREATE INDEX idx_analytics_created_at ON public.analytics_events (created_at DESC);
CREATE INDEX idx_analytics_event_type ON public.analytics_events (event_type, page);
