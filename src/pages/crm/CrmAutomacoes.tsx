import { useState } from "react";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, Trash } from "lucide-react";
import { useAutomations, useTemplates } from "@/hooks/useCrm";
import { TRIGGER_LABELS, type AutomationTrigger } from "@/lib/crmTypes";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { safeDbError } from "@/lib/errorMessages";

export default function CrmAutomacoes() {
  const { data: automations = [] } = useAutomations();
  const { data: templates = [] } = useTemplates();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ nome: "", trigger: "lead_novo", template_id: "", delay_dias: 0, ativa: true });

  const save = async () => {
    if (!form.nome) return toast({ title: "Nome obrigatório", variant: "destructive" });
    const { error } = await supabase.from("crm_automations" as any).insert({ ...form, template_id: form.template_id || null });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    qc.invalidateQueries({ queryKey: ["crm_automations"] });
    setOpen(false);
    setForm({ nome: "", trigger: "lead_novo", template_id: "", delay_dias: 0, ativa: true });
    toast({ title: "Automação criada" });
  };

  const toggle = async (id: string, ativa: boolean) => {
    await supabase.from("crm_automations" as any).update({ ativa: !ativa }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["crm_automations"] });
  };

  const remove = async (id: string) => {
    await supabase.from("crm_automations" as any).delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["crm_automations"] });
  };

  return (
    <CrmLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold flex items-center gap-2"><Zap className="h-7 w-7 text-amber-500" />Automações</h1>
          <p className="text-muted-foreground">Gatilhos que criam tarefas para envio via WhatsApp (wa.me)</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nova automação</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova automação</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
              <div>
                <Label>Gatilho</Label>
                <Select value={form.trigger} onValueChange={(v) => setForm({ ...form, trigger: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TRIGGER_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Template a enviar</Label>
                <Select value={form.template_id} onValueChange={(v) => setForm({ ...form, template_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Escolha um template" /></SelectTrigger>
                  <SelectContent>
                    {templates.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Delay (dias)</Label><Input type="number" value={form.delay_dias} onChange={(e) => setForm({ ...form, delay_dias: Number(e.target.value) })} /></div>
            </div>
            <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-4 border-primary/30 bg-primary/5">
        <CardContent className="p-4 text-sm">
          <p className="font-semibold">Como funciona</p>
          <p className="text-muted-foreground mt-1">
            As automações criam <strong>tarefas na agenda</strong> baseadas no gatilho. Quando você clica em "Enviar WhatsApp", abrimos o wa.me com a mensagem pronta — sem usar API da Meta nem n8n.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {automations.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Nenhuma automação configurada.</CardContent></Card>
        )}
        {automations.map((a: any) => {
          const tpl = templates.find((t: any) => t.id === a.template_id);
          return (
            <Card key={a.id}>
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{a.nome}</p>
                    <Badge variant="outline">{TRIGGER_LABELS[a.trigger as AutomationTrigger]}</Badge>
                    {a.delay_dias > 0 && <Badge variant="secondary">+{a.delay_dias}d</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Template: {tpl?.nome ?? "—"} • {a.execucoes ?? 0} execuções</p>
                </div>
                <Switch checked={a.ativa} onCheckedChange={() => toggle(a.id, a.ativa)} />
                <Button size="icon" variant="ghost" onClick={() => remove(a.id)}><Trash className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </CrmLayout>
  );
}
