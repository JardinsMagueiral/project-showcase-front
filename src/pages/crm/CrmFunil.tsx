import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { STATUS_LABELS, STATUS_ORDER, COLUMN_BORDER, formatCurrency, type LeadStatus } from "@/lib/crmTypes";
import { useLeads, useUpdateLeadStatus } from "@/hooks/useCrm";
import { toast } from "@/hooks/use-toast";

export default function CrmFunil() {
  const { data: leads = [] } = useLeads();
  const updateStatus = useUpdateLeadStatus();

  const onDrop = async (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/lead");
    if (!id) return;
    try {
      await updateStatus.mutateAsync({ id, status });
      toast({ title: `Lead movido para ${STATUS_LABELS[status]}` });
    } catch (err: any) {
      toast({ title: "Erro ao mover", description: err.message, variant: "destructive" });
    }
  };

  return (
    <CrmLayout>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold">Funil de Vendas</h1>
        <p className="text-muted-foreground">Arraste os cards entre as colunas para mudar o status</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {STATUS_ORDER.map((status) => {
          const colLeads = leads.filter((l) => l.status === status);
          const total = colLeads.reduce((sum, l) => sum + (l.valor_aproximado_imovel ?? 0), 0);
          return (
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, status)}
              className={`rounded-lg border-t-4 bg-card ${COLUMN_BORDER[status]}`}
            >
              <div className="border-b p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{STATUS_LABELS[status]}</p>
                  <Badge variant="secondary">{colLeads.length}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{formatCurrency(total)}</p>
              </div>
              <div className="space-y-2 p-2 min-h-[200px]">
                {colLeads.map((l) => (
                  <div
                    key={l.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/lead", l.id)}
                  >
                    <Link to={`/crm/leads/${l.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                        <CardContent className="p-3">
                          <p className="font-medium text-sm">{l.nome}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{l.tipo_imovel || "—"} • {l.interesse || "—"}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(l.tags ?? []).slice(0, 2).map((t) => <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>)}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{formatCurrency(l.valor_aproximado_imovel)}</span>
                            <Badge variant="outline" className="text-[10px]">Score {l.score}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </CrmLayout>
  );
}
