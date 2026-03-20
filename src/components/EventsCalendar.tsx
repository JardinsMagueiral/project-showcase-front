import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const mockEventos: { id: string; data: string; titulo: string; descricao: string }[] = [];

export function EventsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const eventsOnSelectedDate = mockEventos.filter(
    (evento) => selectedDate && evento.data === format(selectedDate, "yyyy-MM-dd")
  );

  const datesWithEvents = mockEventos.map((e) => new Date(e.data + "T12:00:00"));

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
                <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Sugerir Evento</Button>
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
    </section>
  );
}
