import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Trash2, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminEventos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ["admin-eventos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("eventos").select("*").order("data", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("eventos").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-eventos"] });
      toast({ title: status === "aprovado" ? "Evento aprovado!" : "Evento rejeitado" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("eventos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-eventos"] });
      toast({ title: "Evento excluído" });
    },
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "aprovado": return <Badge className="bg-green-500">Aprovado</Badge>;
      case "rejeitado": return <Badge variant="destructive">Rejeitado</Badge>;
      default: return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const filterEventos = (status: string) => status === "todos" ? eventos : eventos.filter(e => e.status === status);

  const EventoCard = ({ evento }: { evento: typeof eventos[0] }) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{evento.titulo}</CardTitle>
            <CardDescription>{format(new Date(evento.data + "T12:00:00"), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</CardDescription>
          </div>
          {getStatusBadge(evento.status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">{evento.descricao || "Sem descrição"}</p>
        <div className="flex flex-wrap gap-2">
          {evento.status === "pendente" && (
            <>
              <Button size="sm" onClick={() => updateMutation.mutate({ id: evento.id, status: "aprovado" })}><CheckCircle className="mr-1 h-4 w-4" />Aprovar</Button>
              <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: evento.id, status: "rejeitado" })}><XCircle className="mr-1 h-4 w-4" />Rejeitar</Button>
            </>
          )}
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Excluir?")) deleteMutation.mutate(evento.id); }}>
            <Trash2 className="mr-1 h-4 w-4" />Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="flex min-h-screen flex-col bg-background"><Header /><main className="flex-1 py-8"><div className="container px-4"><Skeleton className="h-96" /></div></main><Footer /></div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="mb-8">
            <h1 className="flex items-center gap-2 font-serif text-3xl font-bold"><CalendarDays className="h-8 w-8" />Gerenciar Eventos</h1>
            <p className="text-muted-foreground">Aprove ou rejeite eventos sugeridos pela comunidade</p>
          </div>
          <Tabs defaultValue="pendente">
            <TabsList className="mb-6">
              <TabsTrigger value="pendente">Pendentes ({filterEventos("pendente").length})</TabsTrigger>
              <TabsTrigger value="aprovado">Aprovados ({filterEventos("aprovado").length})</TabsTrigger>
              <TabsTrigger value="rejeitado">Rejeitados ({filterEventos("rejeitado").length})</TabsTrigger>
              <TabsTrigger value="todos">Todos ({eventos.length})</TabsTrigger>
            </TabsList>
            {["pendente", "aprovado", "rejeitado", "todos"].map((status) => (
              <TabsContent key={status} value={status}>
                {filterEventos(status).length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">Nenhum evento {status === "todos" ? "cadastrado" : status}</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filterEventos(status).map((evento) => <EventoCard key={evento.id} evento={evento} />)}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
