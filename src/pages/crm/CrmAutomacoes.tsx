import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Zap, ArrowRight } from "lucide-react";
import { MOCK_AUTOMATIONS } from "@/lib/crmMockData";

export default function CrmAutomacoes() {
  return (
    <CrmLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Automações</h1>
          <p className="text-muted-foreground">Fluxos automáticos baseados em eventos</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Nova automação</Button>
      </div>

      <div className="grid gap-4">
        {MOCK_AUTOMATIONS.map(a => (
          <Card key={a.id}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{a.nome}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">Quando: {a.trigger}</Badge>
                      <ArrowRight className="h-4 w-4" />
                      <Badge variant="outline">Faz: {a.acao}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Execuções</p>
                    <p className="font-semibold">{a.execucoes}</p>
                  </div>
                  <Switch defaultChecked={a.ativa} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-dashed">
        <CardHeader><CardTitle>Lead Scoring — pontuação automática</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Pontue leads automaticamente conforme o comportamento:</p>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <div className="flex items-center justify-between rounded border p-2"><span>Abriu mensagem</span><Badge>+5</Badge></div>
            <div className="flex items-center justify-between rounded border p-2"><span>Respondeu WhatsApp</span><Badge>+15</Badge></div>
            <div className="flex items-center justify-between rounded border p-2"><span>Agendou visita</span><Badge>+30</Badge></div>
            <div className="flex items-center justify-between rounded border p-2"><span>Realizou visita</span><Badge>+40</Badge></div>
            <div className="flex items-center justify-between rounded border p-2"><span>Solicitou proposta</span><Badge>+50</Badge></div>
            <div className="flex items-center justify-between rounded border p-2"><span>Sem resposta 7d</span><Badge variant="destructive">-10</Badge></div>
          </div>
        </CardContent>
      </Card>
    </CrmLayout>
  );
}
