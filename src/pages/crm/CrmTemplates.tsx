import { useState } from "react";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Trash, Edit, Upload, Link as LinkIcon, X } from "lucide-react";
import { useTemplates } from "@/hooks/useCrm";
import { PLACEHOLDERS } from "@/lib/crmTypes";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface Anexo { tipo: "arquivo" | "link"; url: string; nome: string }

export default function CrmTemplates() {
  const { data: templates = [] } = useTemplates();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const blank = { nome: "", canal: "whatsapp", mensagem: "", anexos: [] as Anexo[], incluir_fotos_imovel: false, ativo: true };
  const [form, setForm] = useState<any>(blank);
  const [linkUrl, setLinkUrl] = useState("");

  const openNew = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (t: any) => { setEditing(t); setForm({ ...t, anexos: t.anexos ?? [] }); setOpen(true); };

  const save = async () => {
    if (!form.nome || !form.mensagem) return toast({ title: "Preencha nome e mensagem", variant: "destructive" });
    const payload = { nome: form.nome, canal: form.canal, mensagem: form.mensagem, anexos: form.anexos, incluir_fotos_imovel: form.incluir_fotos_imovel, ativo: form.ativo };
    let error;
    if (editing) {
      ({ error } = await supabase.from("crm_templates" as any).update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("crm_templates" as any).insert(payload));
    }
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    qc.invalidateQueries({ queryKey: ["crm_templates"] });
    setOpen(false);
    toast({ title: editing ? "Template atualizado" : "Template criado" });
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir este template?")) return;
    await supabase.from("crm_templates" as any).delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["crm_templates"] });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("crm-anexos").upload(path, file);
    if (error) return toast({ title: "Erro ao subir", description: error.message, variant: "destructive" });
    const { data } = supabase.storage.from("crm-anexos").getPublicUrl(path);
    setForm((f: any) => ({ ...f, anexos: [...f.anexos, { tipo: "arquivo", url: data.publicUrl, nome: file.name }] }));
    e.target.value = "";
  };

  const addLink = () => {
    if (!linkUrl) return;
    setForm((f: any) => ({ ...f, anexos: [...f.anexos, { tipo: "link", url: linkUrl, nome: linkUrl }] }));
    setLinkUrl("");
  };

  const removeAnexo = (idx: number) => {
    setForm((f: any) => ({ ...f, anexos: f.anexos.filter((_: any, i: number) => i !== idx) }));
  };

  const insertPlaceholder = (p: string) => {
    setForm((f: any) => ({ ...f, mensagem: (f.mensagem || "") + p }));
  };

  return (
    <CrmLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold flex items-center gap-2"><MessageSquare className="h-7 w-7" />Templates</h1>
          <p className="text-muted-foreground">Modelos de mensagens com placeholders, anexos e fotos do imóvel</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Novo template</Button>
      </div>

      <div className="grid gap-3">
        {templates.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Nenhum template criado.</CardContent></Card>
        )}
        {templates.map((t: any) => (
          <Card key={t.id}>
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold">{t.nome}</p>
                  <Badge variant="outline" className="capitalize">{t.canal}</Badge>
                  {t.incluir_fotos_imovel && <Badge variant="secondary">+ fotos do imóvel</Badge>}
                  {!t.ativo && <Badge variant="destructive">Inativo</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap line-clamp-3">{t.mensagem}</p>
                {(t.anexos ?? []).length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">{t.anexos.length} anexo(s)</p>
                )}
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(t)}><Edit className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(t.id)}><Trash className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Editar template" : "Novo template"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
              <div>
                <Label>Canal</Label>
                <Select value={form.canal} onValueChange={(v) => setForm({ ...form, canal: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Mensagem</Label>
              <Textarea rows={6} value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} placeholder="Use {{nome}}, {{imovel_titulo}}…" />
              <div className="flex flex-wrap gap-1 mt-2">
                {PLACEHOLDERS.map((p) => (
                  <Button key={p} type="button" size="sm" variant="outline" className="h-6 text-xs" onClick={() => insertPlaceholder(p)}>{p}</Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="cursor-pointer">Incluir fotos do imóvel</Label>
                <p className="text-xs text-muted-foreground">Quando enviar um imóvel, anexa as fotos do anúncio</p>
              </div>
              <Switch checked={form.incluir_fotos_imovel} onCheckedChange={(v) => setForm({ ...form, incluir_fotos_imovel: v })} />
            </div>
            <div>
              <Label>Anexos & links</Label>
              <div className="flex gap-2 mt-1">
                <label className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" asChild><span><Upload className="mr-2 h-4 w-4" />Arquivo</span></Button>
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
                <div className="flex flex-1 gap-1">
                  <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…" />
                  <Button type="button" variant="outline" size="sm" onClick={addLink}><LinkIcon className="mr-2 h-4 w-4" />Add link</Button>
                </div>
              </div>
              <div className="space-y-1 mt-2">
                {form.anexos.map((a: Anexo, i: number) => (
                  <div key={i} className="flex items-center gap-2 rounded border p-2 text-sm">
                    <Badge variant="outline" className="capitalize">{a.tipo}</Badge>
                    <a href={a.url} target="_blank" rel="noreferrer" className="flex-1 truncate hover:underline">{a.nome}</a>
                    <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeAnexo(i)}><X className="h-3 w-3" /></Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Ativo</Label>
              <Switch checked={form.ativo} onCheckedChange={(v) => setForm({ ...form, ativo: v })} />
            </div>
          </div>
          <DialogFooter><Button onClick={save}>{editing ? "Atualizar" : "Criar"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </CrmLayout>
  );
}
