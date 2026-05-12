import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLeads } from "@/hooks/useCrm";
import { STATUS_LABELS, STATUS_ORDER, formatCurrency } from "@/lib/crmTypes";
import { TrendingUp, Clock, Target, Flame } from "lucide-react";

export default function CrmMetricas() {
  const { data: leads = [] } = useLeads();

  const total = leads.length;
  const fechados = leads.filter((l) => l.status === "fechado");
  const conversao = total ? Math.round((fechados.length / total) * 100) : 0;

  // tempo médio de fechamento em dias
  const tempos = fechados.map((l) => (new Date(l.updated_at).getTime() - new Date(l.created_at).getTime()) / 86400000);
  const tempoMedio = tempos.length ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length) : 0;

  const ativos = leads.filter((l) => !["fechado", "perdido"].includes(l.status));
  const quentes = ativos.filter((l) => l.score >= 75).length;

  const valorFechado = fechados.reduce((s, l) => s + (l.valor_aproximado_imovel ?? 0), 0);

  // Ranking de leads mais quentes
  const ranking = [...ativos].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <CrmLayout>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold">Métricas & Relatórios</h1>
        <p className="text-muted-foreground">Performance do funil em tempo real</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPI label="Taxa de conversão" value={`${conversao}%`} icon={Target} />
        <KPI label="Tempo médio fechamento" value={`${tempoMedio} dias`} icon={Clock} />
        <KPI label="Leads quentes ativos" value={quentes} icon={Flame} />
        <KPI label="Valor fechado" value={formatCurrency(valorFechado)} icon={TrendingUp} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Distribuição do funil</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {STATUS_ORDER.map((s) => {
              const items = leads.filter((l) => l.status === s);
              const pct = total ? (items.length / total) * 100 : 0;
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{STATUS_LABELS[s]}</span>
                    <span className="text-muted-foreground">{items.length} • {pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top leads mais quentes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {ranking.length === 0 && <p className="text-sm text-muted-foreground">Sem leads ativos.</p>}
            {ranking.map((l, i) => (
              <div key={l.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{i + 1}</Badge>
                  <div>
                    <p className="font-medium">{l.nome}</p>
                    <p className="text-xs text-muted-foreground">{l.tipo_imovel || "—"} • {formatCurrency(l.valor_aproximado_imovel)}</p>
                  </div>
                </div>
                <Badge>Score {l.score}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </CrmLayout>
  );
}

function KPI({ label, value, icon: Icon }: { label: string; value: number | string; icon: any }) {
  return (
    <Card><CardContent className="flex items-center justify-between p-5">
      <div><p className="text-xs uppercase text-muted-foreground">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></div>
      <Icon className="h-8 w-8 text-primary/40" />
    </CardContent></Card>
  );
}
