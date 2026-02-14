
-- Fix purchases RLS: use auth.jwt() instead of querying auth.users
DROP POLICY IF EXISTS "Users can view own purchases" ON public.purchases;

CREATE POLICY "Users can view own purchases"
ON public.purchases
FOR SELECT
TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'));

-- Fix deliverables RLS: same issue
DROP POLICY IF EXISTS "Users can view deliverables for purchased products" ON public.deliverables;

CREATE POLICY "Users can view deliverables for purchased products"
ON public.deliverables
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.purchases
    WHERE purchases.product_slug = deliverables.product_slug
    AND purchases.buyer_email = (auth.jwt() ->> 'email')
  )
);

-- Fix storage RLS: same issue
DROP POLICY IF EXISTS "Purchased users can access deliverable files" ON storage.objects;

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
    AND p.buyer_email = (auth.jwt() ->> 'email')
  )
);
