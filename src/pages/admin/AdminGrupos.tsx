import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, ArrowLeft, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Grupo {
  id: string;
  titulo: string;
  descricao: string | null;
  link: string;
  ordem: number;
  ativo: boolean;
}

const mockGrupos: Grupo[] = [];

export default function AdminGrupos() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Grupo[]>(mockGrupos);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Grupo | null>(null);
  const [form, setForm] = useState({ titulo: "", descricao: "", link: "", ordem: 0 });

  const openNew = () => {
    setEditing(null);
    setForm({ titulo: "", descricao: "", link: "", ordem: groups.length + 1 });
    setDialogOpen(true);
  };

  const openEdit = (g: Grupo) => {
    setEditing(g);
    setForm({ titulo: g.titulo, descricao: g.descricao || "", link: g.link, ordem: g.ordem });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.titulo || !form.link) {
      toast({ title: "Preencha título e link", variant: "destructive" });
      return;
    }
    if (editing) {
      setGroups(groups.map(g => g.id === editing.id ? { ...g, titulo: form.titulo, descricao: form.descricao || null, link: form.link, ordem: form.ordem } : g));
    } else {
      const newGroup: Grupo = { id: String(Date.now()), titulo: form.titulo, descricao: form.descricao || null, link: form.link, ordem: form.ordem, ativo: true };
      setGroups([...groups, newGroup]);
    }
    toast({ title: editing ? "Grupo atualizado!" : "Grupo criado!" });
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
    toast({ title: "Grupo excluído!" });
  };

  const toggleAtivo = (g: Grupo) => {
    setGroups(groups.map(gr => gr.id === g.id ? { ...gr, ativo: !gr.ativo } : gr));
  };

  return (
    <>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 py-8">
          <div className="container px-4">
            <div className="mb-6 flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild><Link to="/admin"><ArrowLeft className="h-5 w-5" /></Link></Button>
              <h1 className="font-serif text-2xl font-bold">Grupos WhatsApp</h1>
              <div className="ml-auto"><Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Novo Grupo</Button></div>
            </div>
            <div className="grid gap-4">
              {groups.map(g => (
                <Card key={g.id} className={!g.ativo ? "opacity-50" : ""}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      {g.titulo}
                      <span className="text-sm font-normal text-muted-foreground">— Ordem: {g.ordem}</span>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`ativo-${g.id}`} className="text-sm">Ativo</Label>
                        <Switch id={`ativo-${g.id}`} checked={g.ativo} onCheckedChange={() => toggleAtivo(g)} />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(g)}><Pencil className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Excluir grupo?</AlertDialogTitle><AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(g.id)}>Excluir</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{g.descricao}</p>
                    <a href={g.link} target="_blank" className="text-sm text-primary hover:underline">{g.link}</a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar Grupo" : "Novo Grupo"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Título</Label><Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Geral 🔊" /></div>
            <div><Label>Descrição</Label><Input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Ex: Grupo principal da comunidade" /></div>
            <div><Label>Link do WhatsApp</Label><Input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://chat.whatsapp.com/..." /></div>
            <div><Label>Ordem</Label><Input type="number" value={form.ordem} onChange={e => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })} /></div>
            <Button className="w-full" onClick={handleSave}>{editing ? "Salvar Alterações" : "Criar Grupo"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
