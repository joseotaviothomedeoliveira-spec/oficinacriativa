
-- Drop all existing RESTRICTIVE policies on purchases
DROP POLICY IF EXISTS "Service role can insert purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can view own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Admins can delete purchases" ON public.purchases;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Users can view own purchases"
ON public.purchases
FOR SELECT
USING (buyer_email = (auth.jwt() ->> 'email'::text));

CREATE POLICY "Admins can view all purchases"
ON public.purchases
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert purchases"
ON public.purchases
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can insert purchases"
ON public.purchases
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can delete purchases"
ON public.purchases
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Also fix deliverables SELECT policy (also RESTRICTIVE)
DROP POLICY IF EXISTS "Users can view deliverables for purchased products" ON public.deliverables;
DROP POLICY IF EXISTS "Service role can manage deliverables" ON public.deliverables;

CREATE POLICY "Users can view deliverables for purchased products"
ON public.deliverables
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM purchases
  WHERE purchases.product_slug = deliverables.product_slug
  AND purchases.buyer_email = (auth.jwt() ->> 'email'::text)
));

CREATE POLICY "Service role can manage deliverables"
ON public.deliverables
FOR ALL
USING (true)
WITH CHECK (true);
