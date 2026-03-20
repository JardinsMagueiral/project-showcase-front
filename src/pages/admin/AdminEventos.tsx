import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Trash2, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Evento {
  id: string;
  data: string;
  titulo: string;
  descricao: string | null;
  status: string;
}

const mockEventos: Evento[] = [
  { id: "1", data: "2024-03-15", titulo: "Festa Junina do Mangueiral", descricao: "Festa junina com comidas típicas e quadrilha", status: "pendente" },
  { id: "2", data: "2024-04-20", titulo: "Mutirão de Limpeza", descricao: "Mutirão para limpeza das áreas comuns", status: "aprovado" },
  { id: "3", data: "2024-05-10", titulo: "Reunião de Moradores", descricao: "Reunião mensal para discussão de pautas do condomínio", status: "aprovado" },
  { id: "4", data: "2024-03-25", titulo: "Bazar Solidário", descricao: null, status: "rejeitado" },
  { id: "5", data: "2024-06-01", titulo: "Dia das Crianças Antecipado", descricao: "Evento com brinquedos infláveis e brincadeiras", status: "pendente" },
];

export default function AdminEventos() {
  const [eventos, setEventos] = useState<Evento[]>(mockEventos);
  const { toast } = useToast();

  const handleUpdateStatus = (id: string, status: "aprovado" | "rejeitado") => {
    setEventos(eventos.map(e => e.id === id ? { ...e, status } : e));
    toast({ title: status === "aprovado" ? "Evento aprovado!" : "Evento rejeitado" });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    setEventos(eventos.filter(e => e.id !== id));
    toast({ title: "Evento excluído" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aprovado": return <Badge className="bg-green-500">Aprovado</Badge>;
      case "rejeitado": return <Badge variant="destructive">Rejeitado</Badge>;
      default: return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const filterEventos = (status: string) => status === "todos" ? eventos : eventos.filter(e => e.status === status);

  const EventoCard = ({ evento }: { evento: Evento }) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{evento.titulo}</CardTitle>
            <CardDescription>
              {format(new Date(evento.data + "T12:00:00"), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardDescription>
          </div>
          {getStatusBadge(evento.status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">{evento.descricao || "Sem descrição"}</p>
        <div className="flex flex-wrap gap-2">
          {evento.status === "pendente" && (
            <>
              <Button size="sm" onClick={() => handleUpdateStatus(evento.id, "aprovado")}>
                <CheckCircle className="mr-1 h-4 w-4" />Aprovar
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(evento.id, "rejeitado")}>
                <XCircle className="mr-1 h-4 w-4" />Rejeitar
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(evento.id)}>
            <Trash2 className="mr-1 h-4 w-4" />Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="mb-8">
            <h1 className="flex items-center gap-2 font-serif text-3xl font-bold">
              <CalendarDays className="h-8 w-8" />Gerenciar Eventos
            </h1>
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
