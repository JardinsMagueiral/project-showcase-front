import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_LEADS, STATUS_LABELS, type LeadStatus } from "@/lib/crmMockData";
import { Link } from "react-router-dom";

const COLUMN_STYLES: Record<LeadStatus, string> = {
  novo: "border-t-blue-500",
  atendimento: "border-t-amber-500",
  proposta: "border-t-purple-500",
  fechado: "border-t-emerald-500",
  perdido: "border-t-rose-500",
};

const ORDER: LeadStatus[] = ["novo", "atendimento", "proposta", "fechado", "perdido"];

export default function CrmFunil() {
  return (
    <CrmLayout>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold">Funil de Vendas</h1>
        <p className="text-muted-foreground">Visualize o pipeline em formato kanban</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {ORDER.map(status => {
          const leads = MOCK_LEADS.filter(l => l.status === status);
          const total = leads.reduce((sum, l) => sum + (l.preferencias.valorMax + l.preferencias.valorMin) / 2, 0);
          return (
            <div key={status} className={`rounded-lg border-t-4 bg-card ${COLUMN_STYLES[status]}`}>
              <div className="border-b p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{STATUS_LABELS[status]}</p>
                  <Badge variant="secondary">{leads.length}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">R$ {total.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="space-y-2 p-2 min-h-[200px]">
                {leads.map(l => (
                  <Link key={l.id} to={`/crm/leads/${l.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3">
                        <p className="font-medium text-sm">{l.nome}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{l.tipoImovel} • {l.interesse}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {l.tags.slice(0, 2).map(t => <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>)}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{l.responsavel.split(" ")[0]}</span>
                          <Badge variant="outline" className="text-[10px]">Score {l.score}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </CrmLayout>
  );
}
