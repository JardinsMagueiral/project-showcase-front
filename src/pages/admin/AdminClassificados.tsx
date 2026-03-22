import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, XCircle, Trash2, Eye } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminClassificados() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: classificados = [], isLoading } = useQuery({
    queryKey: ["admin-classificados"],
    queryFn: async () => {
      const { data, error } = await supabase.from("classificados").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("classificados").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-classificados"] });
      toast({ title: `Anúncio ${status === "aprovado" ? "aprovado" : "rejeitado"}!` });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("classificados").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-classificados"] });
      toast({ title: "Anúncio excluído!" });
    },
  });

  const formatPrice = (price: number) => price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "aprovado": return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case "rejeitado": return <Badge variant="destructive">Rejeitado</Badge>;
      default: return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex min-h-screen flex-col bg-background"><Header /><main className="flex-1 py-8"><div className="container px-4"><Skeleton className="h-96" /></div></main><Footer /></div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="mb-6"><Button variant="ghost" asChild><Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link></Button></div>
          <div className="mb-6">
            <h1 className="font-serif text-3xl font-bold">Gerenciar Classificados</h1>
            <p className="text-muted-foreground">{classificados.filter(c => c.status === "pendente").length} anúncio(s) pendente(s)</p>
          </div>
          {classificados.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum anúncio cadastrado.</p>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classificados.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.titulo}</TableCell>
                          <TableCell>{item.categoria}</TableCell>
                          <TableCell>{formatPrice(item.preco)}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" asChild><Link to={`/classificados/${item.id}`}><Eye className="h-4 w-4" /></Link></Button>
                              {item.status !== "aprovado" && (
                                <Button variant="ghost" size="icon" onClick={() => updateMutation.mutate({ id: item.id, status: "aprovado" })} title="Aprovar"><CheckCircle className="h-4 w-4 text-green-600" /></Button>
                              )}
                              {item.status !== "rejeitado" && (
                                <Button variant="ghost" size="icon" onClick={() => updateMutation.mutate({ id: item.id, status: "rejeitado" })} title="Rejeitar"><XCircle className="h-4 w-4 text-red-600" /></Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Excluir"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>Excluir anúncio?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                                  <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => deleteMutation.mutate(item.id)}>Excluir</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
