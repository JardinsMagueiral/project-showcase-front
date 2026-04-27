// Mock data for CRM (frontend only — no DB integration yet)

export type LeadStatus = "novo" | "atendimento" | "proposta" | "fechado" | "perdido";
export type InteractionType = "ligacao" | "whatsapp" | "email" | "visita" | "proposta" | "nota";

export interface Interaction {
  id: string;
  type: InteractionType;
  date: string; // ISO
  summary: string;
  user: string;
}

export interface ImovelEnviado {
  id: string;
  titulo: string;
  preco: number;
  enviadoEm: string;
}

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  renda?: number;
  rendaFaixa?: string;
  interesse: "comprar" | "alugar" | "investir";
  localizacao: string;
  tipoImovel: string;
  status: LeadStatus;
  tags: string[];
  score: number; // 0-100
  responsavel: string;
  ultimoContato: string; // ISO
  proximoFollowUp?: string; // ISO
  preferencias: {
    bairro: string;
    valorMin: number;
    valorMax: number;
    quartos: number;
    metragemMin: number;
    metragemMax: number;
  };
  interactions: Interaction[];
  imoveisEnviados: ImovelEnviado[];
  documentos: { id: string; nome: string; tipo: string }[];
  createdAt: string;
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  novo: "Novo",
  atendimento: "Em Atendimento",
  proposta: "Proposta Enviada",
  fechado: "Fechado",
  perdido: "Perdido",
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  novo: "bg-blue-500/15 text-blue-700 border-blue-500/30",
  atendimento: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  proposta: "bg-purple-500/15 text-purple-700 border-purple-500/30",
  fechado: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  perdido: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const today = new Date();
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000).toISOString();
const daysAhead = (n: number) => new Date(today.getTime() + n * 86400000).toISOString();

export const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    nome: "Mariana Costa",
    telefone: "(61) 99999-1111",
    email: "mariana.costa@email.com",
    renda: 18000,
    rendaFaixa: "R$ 15-20k",
    interesse: "comprar",
    localizacao: "Jardins Mangueiral",
    tipoImovel: "Casa",
    status: "atendimento",
    tags: ["alto padrão", "primeira casa"],
    score: 85,
    responsavel: "Carlos Andrade",
    ultimoContato: daysAgo(2),
    proximoFollowUp: daysAhead(1),
    preferencias: { bairro: "Quadra 8", valorMin: 800000, valorMax: 1200000, quartos: 3, metragemMin: 120, metragemMax: 200 },
    interactions: [
      { id: "i1", type: "whatsapp", date: daysAgo(2), summary: "Enviou interesse pelo site", user: "Sistema" },
      { id: "i2", type: "ligacao", date: daysAgo(1), summary: "Conversa de qualificação - 15min", user: "Carlos Andrade" },
      { id: "i3", type: "visita", date: daysAhead(1), summary: "Visita agendada Quadra 8 Casa 12", user: "Carlos Andrade" },
    ],
    imoveisEnviados: [
      { id: "im1", titulo: "Casa Quadra 8 - 3 suítes", preco: 1100000, enviadoEm: daysAgo(1) },
    ],
    documentos: [{ id: "d1", nome: "RG_Mariana.pdf", tipo: "documento" }],
    createdAt: daysAgo(7),
  },
  {
    id: "2",
    nome: "Roberto Almeida",
    telefone: "(61) 98888-2222",
    email: "roberto@invest.com",
    renda: 45000,
    rendaFaixa: "R$ 40k+",
    interesse: "investir",
    localizacao: "Jardins Mangueiral",
    tipoImovel: "Apartamento",
    status: "proposta",
    tags: ["investidor", "VIP"],
    score: 92,
    responsavel: "Carlos Andrade",
    ultimoContato: daysAgo(1),
    proximoFollowUp: daysAhead(2),
    preferencias: { bairro: "Qualquer", valorMin: 400000, valorMax: 700000, quartos: 2, metragemMin: 60, metragemMax: 90 },
    interactions: [
      { id: "i4", type: "email", date: daysAgo(5), summary: "Recebeu portfólio de investimento", user: "Carlos Andrade" },
      { id: "i5", type: "proposta", date: daysAgo(1), summary: "Proposta R$ 620k - Apto Q12", user: "Carlos Andrade" },
    ],
    imoveisEnviados: [
      { id: "im2", titulo: "Apto Quadra 12", preco: 620000, enviadoEm: daysAgo(3) },
      { id: "im3", titulo: "Apto Quadra 5", preco: 480000, enviadoEm: daysAgo(6) },
    ],
    documentos: [],
    createdAt: daysAgo(20),
  },
  {
    id: "3",
    nome: "Juliana Pereira",
    telefone: "(61) 97777-3333",
    email: "juliana.p@email.com",
    renda: 8000,
    rendaFaixa: "R$ 5-10k",
    interesse: "alugar",
    localizacao: "Jardins Mangueiral",
    tipoImovel: "Kitnet",
    status: "novo",
    tags: ["primeira casa"],
    score: 45,
    responsavel: "Não atribuído",
    ultimoContato: daysAgo(0),
    preferencias: { bairro: "Qualquer", valorMin: 1500, valorMax: 2500, quartos: 1, metragemMin: 30, metragemMax: 50 },
    interactions: [
      { id: "i6", type: "whatsapp", date: daysAgo(0), summary: "Cadastro pelo site - aguardando contato", user: "Sistema" },
    ],
    imoveisEnviados: [],
    documentos: [],
    createdAt: daysAgo(0),
  },
  {
    id: "4",
    nome: "Felipe Souza",
    telefone: "(61) 96666-4444",
    email: "felipe.souza@email.com",
    renda: 25000,
    rendaFaixa: "R$ 20-30k",
    interesse: "comprar",
    localizacao: "Jardins Mangueiral",
    tipoImovel: "Cobertura",
    status: "fechado",
    tags: ["alto padrão", "VIP"],
    score: 100,
    responsavel: "Ana Lopes",
    ultimoContato: daysAgo(15),
    preferencias: { bairro: "Quadra 1", valorMin: 1500000, valorMax: 2500000, quartos: 4, metragemMin: 200, metragemMax: 350 },
    interactions: [
      { id: "i7", type: "proposta", date: daysAgo(20), summary: "Proposta aceita R$ 2.1M", user: "Ana Lopes" },
      { id: "i8", type: "nota", date: daysAgo(15), summary: "Contrato assinado!", user: "Ana Lopes" },
    ],
    imoveisEnviados: [{ id: "im4", titulo: "Cobertura Q1", preco: 2100000, enviadoEm: daysAgo(25) }],
    documentos: [{ id: "d2", nome: "Contrato.pdf", tipo: "contrato" }],
    createdAt: daysAgo(60),
  },
  {
    id: "5",
    nome: "Carla Mendes",
    telefone: "(61) 95555-5555",
    email: "carla@email.com",
    renda: 12000,
    rendaFaixa: "R$ 10-15k",
    interesse: "comprar",
    localizacao: "Jardins Mangueiral",
    tipoImovel: "Apartamento",
    status: "perdido",
    tags: ["primeira casa"],
    score: 20,
    responsavel: "Carlos Andrade",
    ultimoContato: daysAgo(45),
    preferencias: { bairro: "Qualquer", valorMin: 300000, valorMax: 450000, quartos: 2, metragemMin: 50, metragemMax: 70 },
    interactions: [
      { id: "i9", type: "nota", date: daysAgo(45), summary: "Cliente desistiu - financiamento negado", user: "Carlos Andrade" },
    ],
    imoveisEnviados: [],
    documentos: [],
    createdAt: daysAgo(90),
  },
  {
    id: "6",
    nome: "Pedro Henrique",
    telefone: "(61) 94444-6666",
    email: "pedro.h@email.com",
    renda: 30000,
    rendaFaixa: "R$ 30-40k",
    interesse: "comprar",
    localizacao: "Jardins Mangueiral",
    tipoImovel: "Casa",
    status: "atendimento",
    tags: ["alto padrão"],
    score: 78,
    responsavel: "Ana Lopes",
    ultimoContato: daysAgo(10),
    proximoFollowUp: daysAhead(0),
    preferencias: { bairro: "Quadra 3", valorMin: 1000000, valorMax: 1500000, quartos: 4, metragemMin: 180, metragemMax: 250 },
    interactions: [
      { id: "i10", type: "visita", date: daysAgo(10), summary: "Visitou 2 casas - gostou da Q3", user: "Ana Lopes" },
    ],
    imoveisEnviados: [{ id: "im5", titulo: "Casa Q3 - 4 suítes", preco: 1350000, enviadoEm: daysAgo(11) }],
    documentos: [],
    createdAt: daysAgo(30),
  },
];

export const MOCK_CORRETORES = [
  { nome: "Carlos Andrade", leads: 23, vendas: 4, conversao: 17 },
  { nome: "Ana Lopes", leads: 18, vendas: 6, conversao: 33 },
  { nome: "Bruno Lima", leads: 15, vendas: 2, conversao: 13 },
];

export const MOCK_AUTOMATIONS = [
  { id: "a1", nome: "Novo lead → Boas-vindas WhatsApp", trigger: "Lead criado", acao: "Enviar template Boas-vindas", ativa: true, execucoes: 47 },
  { id: "a2", nome: "Sem contato 7 dias → Follow-up", trigger: "Inatividade ≥ 7 dias", acao: "Enviar mensagem de retomada", ativa: true, execucoes: 22 },
  { id: "a3", nome: "Novo imóvel → Notificar matches", trigger: "Imóvel cadastrado", acao: "Notificar leads compatíveis", ativa: true, execucoes: 8 },
  { id: "a4", nome: "Pós-visita → Pedido de feedback", trigger: "Visita realizada +1 dia", acao: "Enviar template feedback", ativa: false, execucoes: 12 },
];

export const MOCK_TEMPLATES = [
  { id: "t1", nome: "Boas-vindas", canal: "WhatsApp", preview: "Olá {{nome}}! Tudo bem? Vi que você se interessou..." },
  { id: "t2", nome: "Follow-up 7d", canal: "WhatsApp", preview: "{{nome}}, faz alguns dias que não falamos..." },
  { id: "t3", nome: "Envio de proposta", canal: "Email", preview: "Segue em anexo a proposta para o imóvel..." },
  { id: "t4", nome: "Pós-visita", canal: "WhatsApp", preview: "Como foi sua visita? Gostaria de saber sua opinião..." },
];

export const MOCK_AGENDA = [
  { id: "ag1", titulo: "Visita - Mariana Costa", tipo: "visita", data: daysAhead(1), hora: "10:00", lead: "Mariana Costa" },
  { id: "ag2", titulo: "Retorno - Pedro Henrique", tipo: "ligacao", data: daysAhead(0), hora: "14:30", lead: "Pedro Henrique" },
  { id: "ag3", titulo: "Reunião - Roberto Almeida", tipo: "reuniao", data: daysAhead(2), hora: "16:00", lead: "Roberto Almeida" },
  { id: "ag4", titulo: "Visita - Familia Silva", tipo: "visita", data: daysAhead(3), hora: "09:00", lead: "Família Silva" },
];
