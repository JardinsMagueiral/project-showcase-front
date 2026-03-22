import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, XCircle, ExternalLink, Clock } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminNoticias() {
  const queryClient = useQueryClient();

  const { data: noticias = [], isLoading } = useQuery({
    queryKey: ["admin-noticias"],
    queryFn: async () => {
      const { data, error } = await supabase.from("noticias").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("noticias").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-noticias"] });
      toast.success(`Notícia ${status === "aprovado" ? "aprovada" : "rejeitada"}!`);
    },
  });

  const statusBadge = (status: string | null) => {
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
          <Button variant="ghost" size="sm" className="mb-4" asChild><Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Voltar ao Painel</Link></Button>
          <h1 className="font-serif text-3xl font-bold mb-6">Gerenciar Notícias</h1>
          {noticias.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma notícia enviada ainda.</p>
          ) : (
            <div className="space-y-4">
              {noticias.map(n => (
                <Card key={n.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {statusBadge(n.status)}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />{n.created_at ? new Date(n.created_at).toLocaleDateString("pt-BR") : "—"}
                          </span>
                        </div>
                        <h3 className="font-semibold">{n.titulo}</h3>
                        {n.descricao && <p className="text-sm text-muted-foreground mt-1">{n.descricao}</p>}
                        {n.link && (
                          <a href={n.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 mt-1">
                            <ExternalLink className="h-3 w-3" />{n.link}
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {n.status !== "aprovado" && (
                          <Button size="sm" onClick={() => updateMutation.mutate({ id: n.id, status: "aprovado" })} disabled={updateMutation.isPending}>
                            <CheckCircle className="mr-1 h-3 w-3" />Aprovar
                          </Button>
                        )}
                        {n.status !== "rejeitado" && (
                          <Button size="sm" variant="destructive" onClick={() => updateMutation.mutate({ id: n.id, status: "rejeitado" })} disabled={updateMutation.isPending}>
                            <XCircle className="mr-1 h-3 w-3" />Rejeitar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
