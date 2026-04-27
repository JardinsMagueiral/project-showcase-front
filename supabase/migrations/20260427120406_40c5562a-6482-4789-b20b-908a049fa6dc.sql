CREATE POLICY "Admins can create properties"
ON public.imoveis
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));