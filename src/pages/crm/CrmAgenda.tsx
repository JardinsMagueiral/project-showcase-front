import { useState } from "react";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, Trash } from "lucide-react";
import { useAgenda, useLeads } from "@/hooks/useCrm";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { safeDbError } from "@/lib/errorMessages";

export default function CrmAgenda() {
  const { data: agenda = [] } = useAgenda();
  const { data: leads = [] } = useLeads();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ titulo: "", tipo: "tarefa", data: "", hora: "", lead_id: "" });

  const save = async () => {
    if (!form.titulo || !form.data) return toast({ title: "Preencha título e data", variant: "destructive" });
    const { error } = await supabase.from("crm_agenda" as any).insert({ ...form, lead_id: form.lead_id || null, hora: form.hora || null });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    qc.invalidateQueries({ queryKey: ["crm_agenda"] });
    setOpen(false);
    setForm({ titulo: "", tipo: "tarefa", data: "", hora: "", lead_id: "" });
    toast({ title: "Compromisso criado" });
  };

  const toggle = async (id: string, current: boolean) => {
    await supabase.from("crm_agenda" as any).update({ concluido: !current }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["crm_agenda"] });
  };
  const remove = async (id: string) => {
    await supabase.from("crm_agenda" as any).delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["crm_agenda"] });
  };

  const labelData = (d: string) => {
    const date = new Date(d + "T00:00:00");
    if (isToday(date)) return "Hoje";
    if (isTomorrow(date)) return "Amanhã";
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <CrmLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Agenda & Follow-ups</h1>
          <p className="text-muted-foreground">{agenda.filter((a) => !a.concluido).length} compromissos pendentes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Novo compromisso</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo compromisso</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Título *</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tarefa">Tarefa</SelectItem>
                      <SelectItem value="ligacao">Ligação</SelectItem>
                      <SelectItem value="visita">Visita</SelectItem>
                      <SelectItem value="reuniao">Reunião</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Lead vinculado</Label>
                  <Select value={form.lead_id} onValueChange={(v) => setForm({ ...form, lead_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {leads.map((l) => <SelectItem key={l.id} value={l.id}>{l.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Data *</Label><Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} /></div>
                <div><Label>Hora</Label><Input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} /></div>
              </div>
            </div>
            <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Próximos compromissos</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {agenda.length === 0 && <p className="text-sm text-muted-foreground">Nenhum compromisso agendado.</p>}
          {agenda.map((a: any) => (
            <div key={a.id} className={`flex items-center gap-3 rounded-lg border p-3 ${a.concluido ? "opacity-60" : ""}`}>
              <Button size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={() => toggle(a.id, a.concluido)}>
                <Check className={`h-4 w-4 ${a.concluido ? "text-emerald-600" : "text-muted-foreground"}`} />
              </Button>
              <div className="flex-1">
                <p className={`font-medium ${a.concluido ? "line-through" : ""}`}>{a.titulo}</p>
                <p className="text-xs text-muted-foreground">
                  {labelData(a.data)} {a.hora ? `às ${String(a.hora).slice(0, 5)}` : ""} {a.lead?.nome ? `• ${a.lead.nome}` : ""}
                </p>
              </div>
              <Badge variant="outline" className="capitalize">{a.tipo}</Badge>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => remove(a.id)}><Trash className="h-4 w-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </CrmLayout>
  );
}
