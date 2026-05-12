import { useState } from "react";
import { Link } from "react-router-dom";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, MessageCircle, Mail, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { STATUS_LABELS, STATUS_COLORS, formatCurrency, waLink, type LeadStatus } from "@/lib/crmTypes";
import { useLeads, useCreateLead } from "@/hooks/useCrm";
import { toast } from "@/hooks/use-toast";

export default function CrmLeads() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const { data: leads = [], isLoading } = useLeads({ search, status: statusFilter });
  const createLead = useCreateLead();

  const allTags = Array.from(new Set(leads.flatMap((l) => l.tags || [])));
  const filtered = tagFilter === "all" ? leads : leads.filter((l) => l.tags?.includes(tagFilter));

  // form state
  const [form, setForm] = useState<any>({ nome: "", telefone: "", email: "", valor_aproximado_imovel: "", interesse: "comprar", localizacao: "", tipo_imovel: "", observacoes: "" });

  const handleSubmit = async () => {
    if (!form.nome) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    try {
      await createLead.mutateAsync({
        ...form,
        valor_aproximado_imovel: form.valor_aproximado_imovel ? Number(form.valor_aproximado_imovel) : null,
        origem: "manual",
        status: "novo",
      });
      toast({ title: "Lead criado com sucesso" });
      setOpen(false);
      setForm({ nome: "", telefone: "", email: "", valor_aproximado_imovel: "", interesse: "comprar", localizacao: "", tipo_imovel: "", observacoes: "" });
    } catch (e: any) {
      toast({ title: "Erro ao criar lead", description: e.message, variant: "destructive" });
    }
  };

  return (
    <CrmLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold">Leads & Clientes</h1>
          <p className="text-muted-foreground">{filtered.length} de {leads.length} contatos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Novo Lead</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Cadastrar novo lead</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome completo" /></div>
                <div><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(61) 99999-0000" /></div>
                <div className="col-span-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div>
                  <Label>Valor aproximado do imóvel</Label>
                  <Input type="number" value={form.valor_aproximado_imovel} onChange={(e) => setForm({ ...form, valor_aproximado_imovel: e.target.value })} placeholder="R$ 800.000" />
                </div>
                <div>
                  <Label>Interesse</Label>
                  <Select value={form.interesse} onValueChange={(v) => setForm({ ...form, interesse: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprar">Comprar</SelectItem>
                      <SelectItem value="alugar">Alugar</SelectItem>
                      <SelectItem value="investir">Investir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Localização desejada</Label><Input value={form.localizacao} onChange={(e) => setForm({ ...form, localizacao: e.target.value })} placeholder="Bairro / Quadra" /></div>
                <div>
                  <Label>Tipo de imóvel</Label>
                  <Select value={form.tipo_imovel} onValueChange={(v) => setForm({ ...form, tipo_imovel: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Cobertura">Cobertura</SelectItem>
                      <SelectItem value="Kitnet">Kitnet</SelectItem>
                      <SelectItem value="Loja">Loja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Observações</Label><Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} rows={3} /></div>
            </div>
            <DialogFooter><Button onClick={handleSubmit} disabled={createLead.isPending}>{createLead.isPending ? "Salvando…" : "Salvar lead"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-4">
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nome, email, telefone…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          {allTags.length > 0 && (
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tag" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as tags</SelectItem>
                {allTags.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Interesse</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Último contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Carregando…</TableCell></TableRow>
              )}
              {!isLoading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum lead encontrado.</TableCell></TableRow>
              )}
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <Link to={`/crm/leads/${l.id}`} className="block">
                      <p className="font-medium">{l.nome}</p>
                      <p className="text-xs text-muted-foreground">{l.email || l.telefone || "—"}</p>
                    </Link>
                  </TableCell>
                  <TableCell><span className="capitalize">{l.interesse ?? "—"}</span> • {l.tipo_imovel ?? "—"}</TableCell>
                  <TableCell><Badge variant="outline" className={STATUS_COLORS[l.status as LeadStatus]}>{STATUS_LABELS[l.status as LeadStatus]}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground capitalize">{l.origem.replace("_", " ")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${l.score}%` }} />
                      </div>
                      <span className="text-xs font-medium">{l.score}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {l.ultimo_contato ? format(new Date(l.ultimo_contato), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {l.telefone && (
                        <a href={waLink(l.telefone, `Olá ${l.nome}!`)} target="_blank" rel="noreferrer">
                          <Button size="icon" variant="ghost" className="h-8 w-8"><MessageCircle className="h-4 w-4" /></Button>
                        </a>
                      )}
                      {l.email && (
                        <a href={`mailto:${l.email}`}>
                          <Button size="icon" variant="ghost" className="h-8 w-8"><Mail className="h-4 w-4" /></Button>
                        </a>
                      )}
                      {l.telefone && (
                        <a href={`tel:${l.telefone}`}>
                          <Button size="icon" variant="ghost" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
                        </a>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </CrmLayout>
  );
}
