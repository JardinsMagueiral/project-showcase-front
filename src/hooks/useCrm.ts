import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CrmLead, LeadStatus } from "@/lib/crmTypes";

export function useLeads(filters?: { status?: string; search?: string; tag?: string }) {
  return useQuery({
    queryKey: ["crm_leads", filters],
    queryFn: async () => {
      let q = supabase.from("crm_leads" as any).select("*").order("created_at", { ascending: false });
      if (filters?.status && filters.status !== "all") q = q.eq("status", filters.status);
      if (filters?.search) q = q.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%,telefone.ilike.%${filters.search}%`);
      if (filters?.tag && filters.tag !== "all") q = q.contains("tags", [filters.tag]);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as CrmLead[]) ?? [];
    },
  });
}

export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: ["crm_lead", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("crm_leads" as any).select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data as unknown as CrmLead | null;
    },
  });
}

export function useLeadInteractions(leadId: string | undefined) {
  return useQuery({
    queryKey: ["crm_interactions", leadId],
    enabled: !!leadId,
    queryFn: async () => {
      const { data, error } = await supabase.from("crm_interactions" as any).select("*").eq("lead_id", leadId!).order("data", { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });
}

export function useLeadImoveisEnviados(leadId: string | undefined) {
  return useQuery({
    queryKey: ["crm_imoveis_enviados", leadId],
    enabled: !!leadId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_imoveis_enviados" as any)
        .select("*")
        .eq("lead_id", leadId!)
        .order("enviado_em", { ascending: false });
      if (error) throw error;
      const rows = (data as any[]) ?? [];
      if (rows.length === 0) return [];
      const ids = rows.map((r) => r.imovel_id);
      const { data: imoveis } = await supabase.from("imoveis").select("id,tipo,bairro,preco,quartos,area_m2").in("id", ids);
      const mapImv = new Map((imoveis ?? []).map((i: any) => [i.id, i]));
      return rows.map((r) => ({ ...r, imovel: mapImv.get(r.imovel_id) }));
    },
  });
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const { error } = await supabase.from("crm_leads" as any).update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm_leads"] });
      qc.invalidateQueries({ queryKey: ["crm_lead"] });
    },
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lead: Partial<CrmLead>) => {
      const { data, error } = await supabase.from("crm_leads" as any).insert(lead as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm_leads"] }),
  });
}

export function useCreateInteraction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (i: { lead_id: string; tipo: string; resumo: string }) => {
      const { data: user } = await supabase.auth.getUser();
      const { error } = await supabase.from("crm_interactions" as any).insert({ ...i, criado_por: user.user?.id });
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["crm_interactions", vars.lead_id] });
      qc.invalidateQueries({ queryKey: ["crm_leads"] });
    },
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: ["crm_templates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("crm_templates" as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });
}

export function useAutomations() {
  return useQuery({
    queryKey: ["crm_automations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("crm_automations" as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });
}

export function useAgenda() {
  return useQuery({
    queryKey: ["crm_agenda"],
    queryFn: async () => {
      const { data, error } = await supabase.from("crm_agenda" as any).select("*, lead:crm_leads(nome)").order("data");
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });
}

export function useImoveisAprovados() {
  return useQuery({
    queryKey: ["imoveis_aprovados"],
    queryFn: async () => {
      const { data, error } = await supabase.from("imoveis").select("*").eq("status", "aprovado");
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });
}

export function useImovelFotos(imovelId: string | null | undefined) {
  return useQuery({
    queryKey: ["imovel_fotos", imovelId],
    enabled: !!imovelId,
    queryFn: async () => {
      const { data, error } = await supabase.from("imovel_fotos").select("url").eq("imovel_id", imovelId!).order("ordem");
      if (error) throw error;
      return ((data as any[]) ?? []).map((d) => d.url as string);
    },
  });
}

export async function logImovelEnviado(lead_id: string, imovel_id: string) {
  const { data: user } = await supabase.auth.getUser();
  await supabase.from("crm_imoveis_enviados" as any).upsert({ lead_id, imovel_id, enviado_por: user.user?.id });
}
