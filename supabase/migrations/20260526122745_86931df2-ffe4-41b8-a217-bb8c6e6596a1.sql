
-- 1. Fix CRM attachments SELECT policy
DROP POLICY IF EXISTS "CRM users can read anexos" ON storage.objects;
CREATE POLICY "CRM users can read anexos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'crm-anexos' AND public.has_crm_access(auth.uid()));

-- 2. Classificados storage: ownership-restricted DELETE
DROP POLICY IF EXISTS "Authenticated users can delete classificados files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own classificados files" ON storage.objects;
CREATE POLICY "Users can delete their own classificados files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'classificados'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  )
);

-- 3. Parceiros storage: ownership-restricted DELETE
DROP POLICY IF EXISTS "Authenticated users can delete parceiros files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own parceiros files" ON storage.objects;
CREATE POLICY "Users can delete their own parceiros files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'parceiros'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  )
);

-- 4. Block users from self-featuring on imoveis
DROP POLICY IF EXISTS "Users can create their own properties" ON public.imoveis;
CREATE POLICY "Users can create their own properties"
ON public.imoveis FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (status IS NULL OR status = 'pendente')
  AND (destaque IS NULL OR destaque = false)
);

DROP POLICY IF EXISTS "Users can update their own pending properties" ON public.imoveis;
CREATE POLICY "Users can update their own pending properties"
ON public.imoveis FOR UPDATE
USING (auth.uid() = user_id AND status = ANY (ARRAY['pendente'::text, 'rejeitado'::text]))
WITH CHECK (
  auth.uid() = user_id
  AND status = ANY (ARRAY['pendente'::text, 'rejeitado'::text])
  AND (destaque IS NULL OR destaque = false)
);

-- 5. Block users from self-featuring on parceiros
DROP POLICY IF EXISTS "Authenticated users can create partners" ON public.parceiros;
CREATE POLICY "Authenticated users can create partners"
ON public.parceiros FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (status IS NULL OR status = 'pendente')
  AND (destaque IS NULL OR destaque = false)
);

DROP POLICY IF EXISTS "Users can update their own pending/rejected partners" ON public.parceiros;
CREATE POLICY "Users can update their own pending/rejected partners"
ON public.parceiros FOR UPDATE
USING (auth.uid() = user_id AND status = ANY (ARRAY['pendente'::text, 'rejeitado'::text]))
WITH CHECK (
  auth.uid() = user_id
  AND status = ANY (ARRAY['pendente'::text, 'rejeitado'::text])
  AND (destaque IS NULL OR destaque = false)
);

-- 6. Restrict quadras SELECT to authenticated users
DROP POLICY IF EXISTS "Anyone can view quadras" ON public.quadras;
CREATE POLICY "Authenticated users can view quadras"
ON public.quadras FOR SELECT
TO authenticated
USING (true);
