import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, X, Trash2, Eye, Star, StarOff, Pencil } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export default function AdminImoveis() {
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: imoveis = [], isLoading } = useQuery({
    queryKey: ["admin-imoveis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("imoveis")
        .select("*, imovel_fotos(url, ordem)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase.from("imoveis").update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-imoveis"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("imoveis").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-imoveis"] });
      toast({ title: "Imóvel excluído" });
    },
  });

  const updateStatus = (id: string, status: string) => {
    updateMutation.mutate({ id, updates: { status } }, {
      onSuccess: () => toast({ title: `Imóvel ${status === "aprovado" ? "aprovado" : "rejeitado"}` }),
    });
  };

  const toggleDestaque = (id: string, destaque: boolean) => {
    updateMutation.mutate({ id, updates: { destaque: !destaque } }, {
      onSuccess: () => toast({ title: destaque ? "Destaque removido" : "Imóvel destacado" }),
    });
  };

  const getStatusBadge = (status: string | null) => {
    const config: Record<string, { label: string; variant: "secondary" | "default" | "destructive" | "outline" }> = {
      pendente: { label: "Pendente", variant: "secondary" },
      aprovado: { label: "Aprovado", variant: "default" },
      rejeitado: { label: "Rejeitado", variant: "destructive" },
      inativo: { label: "Inativo", variant: "outline" },
    };
    const c = config[status || "pendente"] || config.pendente;
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  const filteredImoveis = filter === "all" ? imoveis : imoveis.filter((i) => i.status === filter);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="mb-6"><Button variant="ghost" asChild><Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link></Button></div>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold">Gerenciar Imóveis</h1>
              <p className="text-muted-foreground">{filteredImoveis.length} imóveis encontrados</p>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Filtrar por status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="aprovado">Aprovados</SelectItem>
                <SelectItem value="rejeitado">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>
          ) : filteredImoveis.length === 0 ? (
            <Card><CardContent className="py-8 text-center"><p className="text-muted-foreground">Nenhum imóvel encontrado</p></CardContent></Card>
          ) : (
            <div className="space-y-4">
              {filteredImoveis.map((imovel) => {
                const fotos = ((imovel as any).imovel_fotos || []).sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0));
                const fotoPrincipal = fotos[0];
                return (
                <Card key={imovel.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-1 gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted sm:h-28 sm:w-28">
                          {fotoPrincipal ? (
                            <img src={fotoPrincipal.url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Sem foto</div>
                          )}
                          {fotos.length > 0 && (
                            <span className="absolute bottom-1 right-1 rounded bg-background/90 px-1.5 py-0.5 text-xs font-medium">
                              {fotos.length} foto{fotos.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold capitalize">{imovel.tipo} para {imovel.operacao}</h3>
                            {getStatusBadge(imovel.status)}
                            {imovel.destaque && <Badge variant="outline" className="border-yellow-500 text-yellow-600"><Star className="mr-1 h-3 w-3 fill-current" />Destaque</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{imovel.endereco}, {imovel.bairro}</p>
                          <p className="text-lg font-bold text-primary">{formatPrice(imovel.preco)}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild><Link to={`/admin/imoveis/${imovel.id}/editar`}><Pencil className="mr-1 h-4 w-4" />Editar fotos e dados</Link></Button>
                        {imovel.status === "pendente" && (
                          <>
                            <Button size="sm" onClick={() => updateStatus(imovel.id, "aprovado")}><Check className="mr-1 h-4 w-4" />Aprovar</Button>
                            <Button variant="destructive" size="sm" onClick={() => updateStatus(imovel.id, "rejeitado")}><X className="mr-1 h-4 w-4" />Rejeitar</Button>
                          </>
                        )}
                        <Button variant="outline" size="sm" onClick={() => toggleDestaque(imovel.id, !!imovel.destaque)}>
                          {imovel.destaque ? <><StarOff className="mr-1 h-4 w-4" />Remover Destaque</> : <><Star className="mr-1 h-4 w-4" />Destacar</>}
                        </Button>
                        <Button variant="outline" size="sm" asChild><Link to={`/imoveis/${imovel.id}`}><Eye className="mr-1 h-4 w-4" />Ver</Link></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="mr-1 h-4 w-4" />Excluir</Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Excluir imóvel?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => deleteMutation.mutate(imovel.id)}>Excluir</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
