// CRM types & helpers — backed by Supabase tables

export type LeadStatus = "novo" | "atendimento" | "proposta" | "fechado" | "perdido";
export type InteractionType = "ligacao" | "whatsapp" | "email" | "visita" | "proposta" | "nota";
export type Interesse = "comprar" | "alugar" | "investir";
export type Origem = "cadastro_site" | "manual" | "classificado" | "contato" | "importado";
export type AutomationTrigger = "lead_novo" | "inativo_7d" | "imovel_novo" | "pos_visita" | "proposta_enviada";

export const STATUS_LABELS: Record<LeadStatus, string> = {
  novo: "Novo",
  atendimento: "Em Atendimento",
  proposta: "Proposta Enviada",
  fechado: "Fechado",
  perdido: "Perdido",
};

export const STATUS_ORDER: LeadStatus[] = ["novo", "atendimento", "proposta", "fechado", "perdido"];

export const STATUS_COLORS: Record<LeadStatus, string> = {
  novo: "bg-blue-500/15 text-blue-700 border-blue-500/30",
  atendimento: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  proposta: "bg-purple-500/15 text-purple-700 border-purple-500/30",
  fechado: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  perdido: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

export const COLUMN_BORDER: Record<LeadStatus, string> = {
  novo: "border-t-blue-500",
  atendimento: "border-t-amber-500",
  proposta: "border-t-purple-500",
  fechado: "border-t-emerald-500",
  perdido: "border-t-rose-500",
};

export const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  lead_novo: "Novo lead criado",
  inativo_7d: "Lead inativo 7+ dias",
  imovel_novo: "Imóvel cadastrado",
  pos_visita: "Após visita",
  proposta_enviada: "Proposta enviada",
};

export interface CrmLead {
  id: string;
  user_id: string | null;
  nome: string;
  telefone: string | null;
  email: string | null;
  valor_aproximado_imovel: number | null;
  interesse: Interesse | null;
  localizacao: string | null;
  tipo_imovel: string | null;
  status: LeadStatus;
  tags: string[];
  score: number;
  responsavel_id: string | null;
  origem: Origem;
  bairro_pref: string | null;
  valor_min: number | null;
  valor_max: number | null;
  quartos_pref: number | null;
  metragem_min: number | null;
  metragem_max: number | null;
  observacoes: string | null;
  ultimo_contato: string | null;
  proximo_followup: string | null;
  created_at: string;
  updated_at: string;
}

export function formatCurrency(v: number | null | undefined): string {
  if (v == null) return "—";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function cleanPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 11) return "55" + digits;
  return digits;
}

export function waLink(phone: string | null | undefined, message: string): string {
  return `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(message)}`;
}

// Apply {{placeholders}} on a template message
export function applyPlaceholders(
  template: string,
  ctx: { lead?: Partial<CrmLead>; imovel?: any; corretor?: { nome?: string } }
): string {
  const map: Record<string, string> = {
    nome: ctx.lead?.nome ?? "",
    telefone: ctx.lead?.telefone ?? "",
    email: ctx.lead?.email ?? "",
    corretor: ctx.corretor?.nome ?? "Equipe Jardins Mangueiral",
    imovel_titulo: ctx.imovel ? `${ctx.imovel.tipo ?? ""} ${ctx.imovel.bairro ?? ""}`.trim() : "",
    imovel_preco: ctx.imovel?.preco ? Number(ctx.imovel.preco).toLocaleString("pt-BR") : "",
    imovel_quartos: ctx.imovel?.quartos?.toString() ?? "",
    imovel_area: ctx.imovel?.area_m2?.toString() ?? "",
    imovel_link: ctx.imovel?.id ? `${window.location.origin}/imovel/${ctx.imovel.id}` : "",
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => map[k] ?? `{{${k}}}`);
}

export const PLACEHOLDERS = [
  "{{nome}}", "{{telefone}}", "{{email}}", "{{corretor}}",
  "{{imovel_titulo}}", "{{imovel_preco}}", "{{imovel_quartos}}", "{{imovel_area}}", "{{imovel_link}}",
];
