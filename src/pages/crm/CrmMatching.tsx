import { useMemo, useState } from "react";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Sparkles, Building2, Send, Bell } from "lucide-react";
import { useLeads, useImoveisAprovados, useTemplates, logImovelEnviado, useCreateInteraction } from "@/hooks/useCrm";
import { supabase } from "@/integrations/supabase/client";
import { applyPlaceholders, formatCurrency, waLink } from "@/lib/crmTypes";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Compute match score between lead and imovel (0-100)
function matchScore(lead: any, imovel: any): number {
  let score = 0;
  // Tipo
  if (lead.tipo_imovel && imovel.tipo && lead.tipo_imovel.toLowerCase() === imovel.tipo.toLowerCase()) score += 30;
  else if (!lead.tipo_imovel) score += 10;
  // Preço
  const min = lead.valor_min ?? (lead.valor_aproximado_imovel ? lead.valor_aproximado_imovel * 0.8 : null);
  const max = lead.valor_max ?? (lead.valor_aproximado_imovel ? lead.valor_aproximado_imovel * 1.2 : null);
  if (min != null && max != null) {
    if (imovel.preco >= min && imovel.preco <= max) score += 35;
    else if (imovel.preco >= min * 0.85 && imovel.preco <= max * 1.15) score += 15;
  } else { score += 10; }
  // Quartos
  if (lead.quartos_pref && imovel.quartos >= lead.quartos_pref) score += 15;
  else if (!lead.quartos_pref) score += 5;
  // Metragem
  if (lead.metragem_min && lead.metragem_max && imovel.area_m2 >= lead.metragem_min && imovel.area_m2 <= lead.metragem_max) score += 10;
  else score += 3;
  // Localização
  if (lead.bairro_pref && imovel.bairro && imovel.bairro.toLowerCase().includes(lead.bairro_pref.toLowerCase())) score += 10;
  else score += 5;
  return Math.min(100, score);
}

export default function CrmMatching() {
  const { data: leads = [] } = useLeads();
  const { data: imoveis = [] } = useImoveisAprovados();
  const { data: templates = [] } = useTemplates();
  const createInteraction = useCreateInteraction();

  // already-sent map: lead_id -> Set<imovel_id>
  const [enviados, setEnviados] = useState<Record<string, Set<string>>>({});
  useMemo(() => {
    supabase.from("crm_imoveis_enviados" as any).select("lead_id, imovel_id").then(({ data }) => {
      const map: Record<string, Set<string>> = {};
      (data as any[] | null)?.forEach((r) => {
        map[r.lead_id] ||= new Set();
        map[r.lead_id].add(r.imovel_id);
      });
      setEnviados(map);
    });
  }, []);

  const activeLeads = leads.filter((l) => !["fechado", "perdido"].includes(l.status));

  // Build matches: per imovel show top-3 leads not previously sent
  const matches = useMemo(() => {
    return imoveis.map((imv: any) => {
      const scored = activeLeads
        .filter((l) => !enviados[l.id]?.has(imv.id))
        .map((l) => ({ lead: l, score: matchScore(l, imv) }))
        .filter((m) => m.score >= 50)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      return { imovel: imv, leads: scored };
    }).filter((m) => m.leads.length > 0)
      .sort((a, b) => (b.leads[0]?.score ?? 0) - (a.leads[0]?.score ?? 0));
  }, [imoveis, activeLeads, enviados]);

  const totalMatches = matches.reduce((s, m) => s + m.leads.length, 0);

  const [sendOpen, setSendOpen] = useState(false);
  const [sendCtx, setSendCtx] = useState<{ lead: any; imovel: any } | null>(null);
  const [tplId, setTplId] = useState("");

  const openSend = (lead: any, imovel: any) => {
    setSendCtx({ lead, imovel });
    const def = templates.find((t: any) => t.canal === "whatsapp" && t.incluir_fotos_imovel) || templates.find((t: any) => t.canal === "whatsapp");
    setTplId(def?.id ?? "");
    setSendOpen(true);
  };

  const handleSend = async () => {
    if (!sendCtx || !tplId) return;
    const tpl = templates.find((t: any) => t.id === tplId);
    if (!tpl) return;
    const { lead, imovel } = sendCtx;
    const { data: fotos } = await supabase.from("imovel_fotos").select("url").eq("imovel_id", imovel.id).order("ordem");
    let msg = applyPlaceholders(tpl.mensagem, { lead, imovel });
    if (tpl.incluir_fotos_imovel && fotos?.length) {
      msg += `\n\nFotos:\n` + fotos.slice(0, 5).map((f: any) => f.url).join("\n");
    }
    const anexos = (tpl.anexos as any[]) ?? [];
    if (anexos.length) msg += `\n\n` + anexos.map((a) => a.url ?? a).join("\n");
    window.open(waLink(lead.telefone, msg), "_blank");
    await logImovelEnviado(lead.id, imovel.id);
    await createInteraction.mutateAsync({ lead_id: lead.id, tipo: "whatsapp", resumo: `Match: enviou ${imovel.tipo} ${imovel.bairro}` });
    setEnviados((prev) => {
      const next = { ...prev };
      next[lead.id] = new Set([...(next[lead.id] ?? []), imovel.id]);
      return next;
    });
    setSendOpen(false);
    toast({ title: "WhatsApp aberto", description: "Envio registrado" });
  };

  return (
    <CrmLayout>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-amber-500" />Ofertas Inteligentes
        </h1>
        <p className="text-muted-foreground">Cruzamento automático entre leads e imóveis aprovados do site</p>
      </div>

      <Card className="mb-6 border-primary/30 bg-primary/5">
        <CardContent className="p-5 flex items-center gap-4">
          <Bell className="h-8 w-8 text-primary shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">{totalMatches} matches encontrados entre {activeLeads.length} leads ativos e {imoveis.length} imóveis</p>
            <p className="text-sm text-muted-foreground">Imóveis já enviados a um lead não aparecem novamente.</p>
          </div>
        </CardContent>
      </Card>

      {matches.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">Nenhum match disponível no momento.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {matches.map(({ imovel, leads: matchedLeads }) => (
            <Card key={imovel.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{imovel.tipo} • {imovel.bairro}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatCurrency(imovel.preco)} • {imovel.quartos} quartos • {imovel.area_m2} m²
                      </p>
                    </div>
                  </div>
                  <Badge>{matchedLeads.length} match{matchedLeads.length > 1 ? "es" : ""}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {matchedLeads.map(({ lead, score }) => (
                  <div key={lead.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link to={`/crm/leads/${lead.id}`} className="font-medium hover:underline">{lead.nome}</Link>
                        <Badge variant="outline">Score {score}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lead.interesse ?? "—"} • valor aprox. {formatCurrency(lead.valor_aproximado_imovel)} • {lead.tipo_imovel ?? "—"}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => openSend(lead, imovel)}><Send className="mr-2 h-4 w-4" />Enviar</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enviar imóvel via WhatsApp</DialogTitle></DialogHeader>
          {sendCtx && (
            <div className="space-y-2 text-sm">
              <p><strong>Para:</strong> {sendCtx.lead.nome} ({sendCtx.lead.telefone || "sem telefone"})</p>
              <p><strong>Imóvel:</strong> {sendCtx.imovel.tipo} • {sendCtx.imovel.bairro} • {formatCurrency(sendCtx.imovel.preco)}</p>
              <div>
                <Label>Template</Label>
                <Select value={tplId} onValueChange={setTplId}>
                  <SelectTrigger><SelectValue placeholder="Escolha um template" /></SelectTrigger>
                  <SelectContent>
                    {templates.filter((t: any) => t.canal === "whatsapp").map((t: any) => (
                      <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={handleSend}>Abrir WhatsApp</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </CrmLayout>
  );
}
