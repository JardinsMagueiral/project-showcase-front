import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Phone, Mail, MessageCircle, Calendar, FileText, Plus, Building2, MapPin, DollarSign, Send } from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS, formatCurrency, waLink, applyPlaceholders, type LeadStatus, type InteractionType } from "@/lib/crmTypes";
import { useLead, useLeadInteractions, useLeadImoveisEnviados, useCreateInteraction, useTemplates, useImoveisAprovados, useImovelFotos, logImovelEnviado, useUpdateLeadStatus } from "@/hooks/useCrm";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ICONS: Record<string, any> = { ligacao: Phone, whatsapp: MessageCircle, email: Mail, visita: Calendar, proposta: FileText, nota: FileText };

export default function CrmLeadDetalhe() {
  const { id } = useParams();
  const { data: lead, isLoading } = useLead(id);
  const { data: interactions = [] } = useLeadInteractions(id);
  const { data: enviados = [] } = useLeadImoveisEnviados(id);
  const { data: templates = [] } = useTemplates();
  const { data: imoveis = [] } = useImoveisAprovados();
  const createInteraction = useCreateInteraction();
  const updateStatus = useUpdateLeadStatus();

  const [newInt, setNewInt] = useState({ tipo: "nota" as InteractionType, resumo: "" });
  const [sendOpen, setSendOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedImovel, setSelectedImovel] = useState<string>("");

  if (isLoading) return <CrmLayout><p className="text-muted-foreground">Carregando…</p></CrmLayout>;
  if (!lead) return <Navigate to="/crm/leads" replace />;

  const handleInteraction = async () => {
    if (!newInt.resumo) return toast({ title: "Resumo obrigatório", variant: "destructive" });
    await createInteraction.mutateAsync({ lead_id: lead.id, tipo: newInt.tipo, resumo: newInt.resumo });
    setNewInt({ tipo: "nota", resumo: "" });
    toast({ title: "Interação registrada" });
  };

  const handleSendImovel = async () => {
    if (!selectedTemplate || !selectedImovel) return toast({ title: "Escolha template e imóvel", variant: "destructive" });
    const tpl = templates.find((t: any) => t.id === selectedTemplate);
    const imv = imoveis.find((i: any) => i.id === selectedImovel);
    if (!tpl || !imv) return;
    // fetch photos
    const { data: fotos } = await supabase.from("imovel_fotos").select("url").eq("imovel_id", imv.id).order("ordem");
    let msg = applyPlaceholders(tpl.mensagem, { lead, imovel: imv });
    if (tpl.incluir_fotos_imovel && fotos?.length) {
      msg += `\n\nFotos:\n` + fotos.slice(0, 5).map((f: any) => f.url).join("\n");
    }
    const anexos = (tpl.anexos as any[]) ?? [];
    if (anexos.length) msg += `\n\n` + anexos.map((a) => a.url ?? a).join("\n");
    const url = waLink(lead.telefone, msg);
    window.open(url, "_blank");
    await logImovelEnviado(lead.id, imv.id);
    await createInteraction.mutateAsync({ lead_id: lead.id, tipo: "whatsapp", resumo: `Enviou imóvel: ${imv.tipo} ${imv.bairro}` });
    setSendOpen(false);
    setSelectedImovel("");
    toast({ title: "WhatsApp aberto", description: "Mensagem registrada no histórico" });
  };

  const quickWhatsApp = (template?: string) => {
    const msg = template ? applyPlaceholders(template, { lead }) : `Olá ${lead.nome}!`;
    window.open(waLink(lead.telefone, msg), "_blank");
    createInteraction.mutate({ lead_id: lead.id, tipo: "whatsapp", resumo: "Abertura de WhatsApp" });
  };

  return (
    <CrmLayout>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-3">
          <Link to="/crm/leads"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl font-bold">{lead.nome}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Select value={lead.status} onValueChange={(v) => updateStatus.mutate({ id: lead.id, status: v as LeadStatus })}>
                <SelectTrigger className="w-[200px] h-8">
                  <Badge variant="outline" className={STATUS_COLORS[lead.status]}>{STATUS_LABELS[lead.status]}</Badge>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
              {(lead.tags ?? []).map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
              <Badge>Score {lead.score}</Badge>
              <Badge variant="outline" className="capitalize">Origem: {lead.origem.replace("_", " ")}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            {lead.telefone && <Button variant="outline" onClick={() => quickWhatsApp()}><MessageCircle className="mr-2 h-4 w-4" />WhatsApp</Button>}
            {lead.email && <a href={`mailto:${lead.email}`}><Button variant="outline"><Mail className="mr-2 h-4 w-4" />Email</Button></a>}
            {lead.telefone && <a href={`tel:${lead.telefone}`}><Button variant="outline"><Phone className="mr-2 h-4 w-4" />Ligar</Button></a>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Tabs defaultValue="timeline">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="imoveis">Imóveis enviados</TabsTrigger>
              <TabsTrigger value="notas">Nova interação</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-4">
              <Card>
                <CardHeader><CardTitle>Histórico de interações</CardTitle></CardHeader>
                <CardContent>
                  {interactions.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma interação ainda.</p>}
                  <ol className="relative border-l border-border ml-3 space-y-6">
                    {interactions.map((i: any) => {
                      const Icon = ICONS[i.tipo] || FileText;
                      return (
                        <li key={i.id} className="ml-6">
                          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Icon className="h-3 w-3" />
                          </span>
                          <p className="text-sm font-medium capitalize">{i.tipo} <span className="text-muted-foreground font-normal">• {format(new Date(i.data), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}</span></p>
                          <p className="text-sm text-muted-foreground">{i.resumo}</p>
                        </li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="imoveis" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Imóveis enviados</CardTitle>
                  <Dialog open={sendOpen} onOpenChange={setSendOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm"><Send className="mr-2 h-4 w-4" />Enviar imóvel</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Enviar imóvel via WhatsApp</DialogTitle></DialogHeader>
                      <div className="space-y-3">
                        <div>
                          <Label>Template</Label>
                          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                            <SelectTrigger><SelectValue placeholder="Escolha um template" /></SelectTrigger>
                            <SelectContent>
                              {templates.filter((t: any) => t.canal === "whatsapp").map((t: any) => (
                                <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Imóvel</Label>
                          <Select value={selectedImovel} onValueChange={setSelectedImovel}>
                            <SelectTrigger><SelectValue placeholder="Escolha um imóvel" /></SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {imoveis.map((i: any) => (
                                <SelectItem key={i.id} value={i.id}>
                                  {i.tipo} • {i.bairro} • {formatCurrency(i.preco)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter><Button onClick={handleSendImovel}>Abrir WhatsApp</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-2">
                  {enviados.length === 0 && <p className="text-sm text-muted-foreground">Nenhum imóvel enviado ainda.</p>}
                  {enviados.map((e: any) => (
                    <div key={e.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{e.imovel ? `${e.imovel.tipo} • ${e.imovel.bairro}` : "Imóvel"}</p>
                          <p className="text-xs text-muted-foreground">Enviado em {format(new Date(e.enviado_em), "dd/MM/yyyy")}</p>
                        </div>
                      </div>
                      {e.imovel && <p className="font-semibold">{formatCurrency(e.imovel.preco)}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notas" className="mt-4">
              <Card>
                <CardHeader><CardTitle>Registrar nova interação</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Tipo</Label>
                      <Select value={newInt.tipo} onValueChange={(v) => setNewInt({ ...newInt, tipo: v as InteractionType })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ligacao">Ligação</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="visita">Visita</SelectItem>
                          <SelectItem value="proposta">Proposta</SelectItem>
                          <SelectItem value="nota">Nota</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><Label>Resumo</Label><Textarea rows={4} value={newInt.resumo} onChange={(e) => setNewInt({ ...newInt, resumo: e.target.value })} placeholder="O que aconteceu nesta interação?" /></div>
                  <Button onClick={handleInteraction} disabled={createInteraction.isPending}><Plus className="mr-2 h-4 w-4" />Registrar</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Contato</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{lead.telefone || "—"}</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{lead.email || "—"}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{lead.localizacao || "—"}</p>
              <p className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" />Valor aprox. do imóvel: {formatCurrency(lead.valor_aproximado_imovel)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Preferências</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Tipo:</span> {lead.tipo_imovel || "—"}</p>
              <p><span className="text-muted-foreground">Interesse:</span> <span className="capitalize">{lead.interesse || "—"}</span></p>
              <p><span className="text-muted-foreground">Bairro:</span> {lead.bairro_pref || "—"}</p>
              <p><span className="text-muted-foreground">Quartos:</span> {lead.quartos_pref ? `${lead.quartos_pref}+` : "—"}</p>
              <p><span className="text-muted-foreground">Valor:</span> {lead.valor_min || lead.valor_max ? `${formatCurrency(lead.valor_min)} - ${formatCurrency(lead.valor_max)}` : "—"}</p>
              {lead.observacoes && <p className="pt-2 text-muted-foreground"><strong>Obs:</strong> {lead.observacoes}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </CrmLayout>
  );
}
