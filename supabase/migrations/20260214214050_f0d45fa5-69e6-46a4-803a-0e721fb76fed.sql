
-- Fix 1: Deliverables RLS - restrict to purchased products only
DROP POLICY IF EXISTS "Authenticated users can view deliverables" ON public.deliverables;

CREATE POLICY "Users can view deliverables for purchased products"
ON public.deliverables
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.purchases
    WHERE purchases.product_slug = deliverables.product_slug
    AND purchases.buyer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Fix 2: Make deliverables storage bucket private
UPDATE storage.buckets SET public = false WHERE id = 'deliverables';

DROP POLICY IF EXISTS "Anyone can read deliverables files" ON storage.objects;

CREATE POLICY "Purchased users can access deliverable files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'deliverables' AND
  EXISTS (
    SELECT 1 FROM public.deliverables d
    INNER JOIN public.purchases p ON d.product_slug = p.product_slug
    WHERE d.file_url LIKE '%' || storage.objects.name || '%'
    AND p.buyer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Fix 3: Push subscriptions - add user ownership
ALTER TABLE public.push_subscriptions
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON public.push_subscriptions(user_id);

DROP POLICY IF EXISTS "Anyone can subscribe to push" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Anyone can unsubscribe" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Service role can read subscriptions" ON public.push_subscriptions;

CREATE POLICY "Authenticated users manage own push subscriptions"
ON public.push_subscriptions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role full access push subscriptions"
ON public.push_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
