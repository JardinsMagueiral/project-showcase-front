
-- ENUMS
DO $$ BEGIN
  CREATE TYPE public.crm_lead_status AS ENUM ('novo','atendimento','proposta','fechado','perdido');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.crm_interesse AS ENUM ('comprar','alugar','investir');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.crm_interaction_type AS ENUM ('ligacao','whatsapp','email','visita','proposta','nota');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.crm_origem AS ENUM ('cadastro_site','manual','classificado','contato','importado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.crm_automation_trigger AS ENUM ('lead_novo','inativo_7d','imovel_novo','pos_visita','proposta_enviada');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Add 'gestor' to existing app_role enum (if not present)
DO $$ BEGIN
  ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'gestor';
EXCEPTION WHEN others THEN null; END $$;

-- Helper: any CRM access (admin OR gestor)
CREATE OR REPLACE FUNCTION public.has_crm_access(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN _user_id IS NULL THEN false
    ELSE EXISTS (SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role IN ('admin','gestor'))
  END
$$;

-- ===== TABLES =====
CREATE TABLE IF NOT EXISTS public.crm_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  nome text NOT NULL,
  telefone text,
  email text,
  valor_aproximado_imovel numeric,
  interesse public.crm_interesse,
  localizacao text,
  tipo_imovel text,
  status public.crm_lead_status NOT NULL DEFAULT 'novo',
  tags text[] DEFAULT '{}',
  score int NOT NULL DEFAULT 50,
  responsavel_id uuid,
  origem public.crm_origem NOT NULL DEFAULT 'manual',
  bairro_pref text,
  valor_min numeric,
  valor_max numeric,
  quartos_pref int,
  metragem_min numeric,
  metragem_max numeric,
  observacoes text,
  ultimo_contato timestamptz DEFAULT now(),
  proximo_followup timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS crm_leads_status_idx ON public.crm_leads(status);
CREATE INDEX IF NOT EXISTS crm_leads_user_idx ON public.crm_leads(user_id);

CREATE TABLE IF NOT EXISTS public.crm_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  tipo public.crm_interaction_type NOT NULL,
  resumo text,
  criado_por uuid,
  data timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS crm_interactions_lead_idx ON public.crm_interactions(lead_id);

CREATE TABLE IF NOT EXISTS public.crm_imoveis_enviados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  imovel_id uuid NOT NULL,
  enviado_em timestamptz NOT NULL DEFAULT now(),
  enviado_por uuid,
  UNIQUE(lead_id, imovel_id)
);

CREATE TABLE IF NOT EXISTS public.crm_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  canal text NOT NULL DEFAULT 'whatsapp',
  mensagem text NOT NULL,
  anexos jsonb DEFAULT '[]'::jsonb,
  incluir_fotos_imovel boolean DEFAULT false,
  ativo boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_agenda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  tipo text NOT NULL DEFAULT 'tarefa',
  data date NOT NULL,
  hora time,
  concluido boolean DEFAULT false,
  responsavel_id uuid,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  trigger public.crm_automation_trigger NOT NULL,
  template_id uuid REFERENCES public.crm_templates(id) ON DELETE SET NULL,
  delay_dias int DEFAULT 0,
  ativa boolean DEFAULT true,
  execucoes int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_automation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id uuid REFERENCES public.crm_automations(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  resultado text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- updated_at trigger
DROP TRIGGER IF EXISTS crm_leads_updated_at ON public.crm_leads;
CREATE TRIGGER crm_leads_updated_at BEFORE UPDATE ON public.crm_leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS crm_templates_updated_at ON public.crm_templates;
CREATE TRIGGER crm_templates_updated_at BEFORE UPDATE ON public.crm_templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== RLS =====
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_imoveis_enviados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRM access leads" ON public.crm_leads FOR ALL
  USING (public.has_crm_access(auth.uid())) WITH CHECK (public.has_crm_access(auth.uid()));
CREATE POLICY "CRM access interactions" ON public.crm_interactions FOR ALL
  USING (public.has_crm_access(auth.uid())) WITH CHECK (public.has_crm_access(auth.uid()));
CREATE POLICY "CRM access enviados" ON public.crm_imoveis_enviados FOR ALL
  USING (public.has_crm_access(auth.uid())) WITH CHECK (public.has_crm_access(auth.uid()));
CREATE POLICY "CRM access templates" ON public.crm_templates FOR ALL
  USING (public.has_crm_access(auth.uid())) WITH CHECK (public.has_crm_access(auth.uid()));
CREATE POLICY "CRM access agenda" ON public.crm_agenda FOR ALL
  USING (public.has_crm_access(auth.uid())) WITH CHECK (public.has_crm_access(auth.uid()));
CREATE POLICY "CRM access automations" ON public.crm_automations FOR ALL
  USING (public.has_crm_access(auth.uid())) WITH CHECK (public.has_crm_access(auth.uid()));
CREATE POLICY "CRM access automation logs" ON public.crm_automation_logs FOR ALL
  USING (public.has_crm_access(auth.uid())) WITH CHECK (public.has_crm_access(auth.uid()));

-- Allow service_role / trigger to insert leads from auth (bypasses RLS via SECURITY DEFINER)
-- ===== TRIGGER: novo usuário -> lead =====
CREATE OR REPLACE FUNCTION public.handle_new_user_crm()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.crm_leads (user_id, nome, telefone, email, origem, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome','Novo usuário'),
    COALESCE(NEW.raw_user_meta_data->>'telefone',''),
    NEW.email,
    'cadastro_site',
    'novo'
  );
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created_crm ON auth.users;
CREATE TRIGGER on_auth_user_created_crm
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_crm();

-- ===== TRIGGER: novo classificado -> lead =====
CREATE OR REPLACE FUNCTION public.handle_new_classificado_crm()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_nome text; v_email text; v_tel text;
BEGIN
  SELECT nome, email, telefone INTO v_nome, v_email, v_tel
  FROM public.profiles WHERE id = NEW.user_id;

  IF NOT EXISTS (SELECT 1 FROM public.crm_leads WHERE user_id = NEW.user_id) THEN
    INSERT INTO public.crm_leads (user_id, nome, telefone, email, origem, status, observacoes)
    VALUES (NEW.user_id, COALESCE(v_nome,'Cliente classificado'), COALESCE(v_tel, NEW.contato_whatsapp), v_email,
            'classificado','novo', 'Publicou classificado: ' || NEW.titulo);
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_classificado_created_crm ON public.classificados;
CREATE TRIGGER on_classificado_created_crm
  AFTER INSERT ON public.classificados
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_classificado_crm();

-- ===== TRIGGER: interação atualiza ultimo_contato =====
CREATE OR REPLACE FUNCTION public.crm_touch_lead_on_interaction()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.crm_leads SET ultimo_contato = NEW.data WHERE id = NEW.lead_id;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_crm_interaction_touch ON public.crm_interactions;
CREATE TRIGGER on_crm_interaction_touch
  AFTER INSERT ON public.crm_interactions
  FOR EACH ROW EXECUTE FUNCTION public.crm_touch_lead_on_interaction();

-- ===== STORAGE BUCKET =====
INSERT INTO storage.buckets (id, name, public)
VALUES ('crm-anexos','crm-anexos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "CRM users can read anexos" ON storage.objects FOR SELECT
  USING (bucket_id = 'crm-anexos');
CREATE POLICY "CRM users can upload anexos" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'crm-anexos' AND public.has_crm_access(auth.uid()));
CREATE POLICY "CRM users can update anexos" ON storage.objects FOR UPDATE
  USING (bucket_id = 'crm-anexos' AND public.has_crm_access(auth.uid()));
CREATE POLICY "CRM users can delete anexos" ON storage.objects FOR DELETE
  USING (bucket_id = 'crm-anexos' AND public.has_crm_access(auth.uid()));

-- ===== Seed alguns templates padrão =====
INSERT INTO public.crm_templates (nome, canal, mensagem, incluir_fotos_imovel, ativo) VALUES
('Boas-vindas','whatsapp','Olá {{nome}}! Tudo bem? Sou do Jardins Mangueiral. Vi que você se interessou pelos nossos imóveis. Posso te ajudar?', false, true),
('Follow-up 7 dias','whatsapp','Oi {{nome}}, faz alguns dias que não conversamos. Ainda está buscando imóvel? Tenho novidades pra te mostrar!', false, true),
('Envio de imóvel','whatsapp','{{nome}}, separei este imóvel especialmente pra você:\n\n📍 {{imovel_titulo}}\n💰 R$ {{imovel_preco}}\n🛏️ {{imovel_quartos}} quartos | 📐 {{imovel_area}}m²\n\n{{imovel_link}}', true, true),
('Pós-visita','whatsapp','Oi {{nome}}, como foi a visita? Gostaria de saber o que achou do imóvel. Qualquer dúvida estou à disposição!', false, true)
ON CONFLICT DO NOTHING;
