-- Allow admins to delete manual purchases (for revoking access)
CREATE POLICY "Admins can delete purchases"
  ON public.purchases FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
