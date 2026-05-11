import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function EventsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState<Date | undefined>(undefined);
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ["eventos-publicos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .eq("status", "aprovado")
        .order("data", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const sugerir = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("auth");
      if (!titulo.trim() || !data) throw new Error("campos");
      const { error } = await supabase.from("eventos").insert({
        user_id: user.id,
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
        data: format(data, "yyyy-MM-dd"),
        status: "pendente",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evento enviado! Aguardando aprovação do administrador.");
      setOpen(false);
      setTitulo("");
      setDescricao("");
      setData(undefined);
      qc.invalidateQueries({ queryKey: ["eventos-publicos"] });
    },
    onError: (e: Error) => {
      if (e.message === "campos") toast.error("Preencha título e data.");
      else if (e.message === "auth") toast.error("Faça login para sugerir um evento.");
      else toast.error("Erro ao enviar evento.");
    },
  });

  const handleOpen = () => {
    if (!user) {
      toast.info("Faça login para sugerir um evento.");
      navigate("/login");
      return;
    }
    setData(selectedDate);
    setOpen(true);
  };

  const eventsOnSelectedDate = eventos.filter(
    (evento) => selectedDate && evento.data === format(selectedDate, "yyyy-MM-dd")
  );

  const datesWithEvents = eventos.map((e) => new Date(e.data + "T12:00:00"));

  if (isLoading) {
    return <section className="bg-muted/50 py-16"><div className="container px-4"><Skeleton className="h-96" /></div></section>;
  }

  return (
    <section className="bg-muted/50 py-16">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Calendário de Eventos</h2>
          <p className="mt-4 text-lg text-muted-foreground">Fique por dentro dos eventos da comunidade</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" /> Calendário</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                modifiers={{ hasEvent: datesWithEvents }}
                modifiersStyles={{ hasEvent: { backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))", fontWeight: "bold" } }}
                className="rounded-md"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}</CardTitle>
                  <CardDescription>{eventsOnSelectedDate.length > 0 ? `${eventsOnSelectedDate.length} evento(s)` : "Nenhum evento nesta data"}</CardDescription>
                </div>
                <Button size="sm" onClick={handleOpen}>
                  <Plus className="mr-1 h-4 w-4" /> Sugerir Evento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eventsOnSelectedDate.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">Nenhum evento agendado para este dia.</p>
                ) : (
                  eventsOnSelectedDate.map((evento) => (
                    <div key={evento.id} className="rounded-lg border bg-card p-4 transition-all hover:shadow-md">
                      <h4 className="font-semibold text-foreground">{evento.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sugerir Evento</DialogTitle>
            <DialogDescription>
              Preencha os dados do evento. Após envio, ele ficará pendente de aprovação pelo administrador.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Nome do evento" />
            </div>
            <div className="space-y-2">
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !data && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data ? format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data}
                    onSelect={setData}
                    locale={ptBR}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Detalhes do evento (horário, local, etc.)"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => sugerir.mutate()} disabled={sugerir.isPending}>
              {sugerir.isPending ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
