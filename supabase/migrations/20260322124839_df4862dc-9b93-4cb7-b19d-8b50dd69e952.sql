-- Fix: Enforce status='pendente' on INSERT for all content tables

-- 1. imoveis
DROP POLICY IF EXISTS "Users can create their own properties" ON imoveis;
CREATE POLICY "Users can create their own properties"
  ON imoveis FOR INSERT TO public
  WITH CHECK (auth.uid() = user_id AND (status IS NULL OR status = 'pendente'));

-- 2. classificados
DROP POLICY IF EXISTS "Users can create their own classificados" ON classificados;
CREATE POLICY "Users can create their own classificados"
  ON classificados FOR INSERT TO public
  WITH CHECK (auth.uid() = user_id AND (status IS NULL OR status = 'pendente'));

-- 3. parceiros
DROP POLICY IF EXISTS "Authenticated users can create partners" ON parceiros;
CREATE POLICY "Authenticated users can create partners"
  ON parceiros FOR INSERT TO public
  WITH CHECK (auth.uid() = user_id AND (status IS NULL OR status = 'pendente'));

-- 4. eventos
DROP POLICY IF EXISTS "Authenticated users can create events" ON eventos;
CREATE POLICY "Authenticated users can create events"
  ON eventos FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND (status IS NULL OR status = 'pendente'));

-- 5. noticias
DROP POLICY IF EXISTS "Authenticated users can create noticias" ON noticias;
CREATE POLICY "Authenticated users can create noticias"
  ON noticias FOR INSERT TO public
  WITH CHECK (auth.uid() = user_id AND (status IS NULL OR status = 'pendente'));