import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, Phone, Users, Bell } from "lucide-react";
import { MOCK_AGENDA, MOCK_LEADS } from "@/lib/crmMockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ICONS: Record<string, any> = { visita: Users, ligacao: Phone, reuniao: CalendarIcon };

export default function CrmAgenda() {
  const semContato = MOCK_LEADS
    .filter(l => !["fechado","perdido"].includes(l.status))
    .map(l => ({ ...l, dias: Math.floor((Date.now() - new Date(l.ultimoContato).getTime()) / 86400000) }))
    .filter(l => l.dias >= 7)
    .sort((a, b) => b.dias - a.dias);

  return (
    <CrmLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Agenda & Follow-ups</h1>
          <p className="text-muted-foreground">Visitas, reuniões e retornos programados</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Novo compromisso</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Próximos compromissos</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {MOCK_AGENDA.map(a => {
              const Icon = ICONS[a.tipo] || CalendarIcon;
              return (
                <div key={a.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{a.titulo}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(a.data), "EEEE, dd 'de' MMM", { locale: ptBR })} às {a.hora}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">{a.tipo}</Badge>
                  <Button size="sm" variant="ghost">Detalhes</Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-rose-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-rose-500" />Alertas: sem contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {semContato.length === 0 && <p className="text-sm text-muted-foreground">Tudo em dia! 🎉</p>}
            {semContato.map(l => (
              <div key={l.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">{l.nome}</p>
                  <p className="text-xs text-rose-600">há {l.dias} dias sem contato</p>
                </div>
                <Button size="sm" variant="outline">Contatar</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </CrmLayout>
  );
}
