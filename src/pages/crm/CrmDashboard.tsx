import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Flame, CalendarClock, TrendingUp, Building2 } from "lucide-react";
import { useLeads, useAgenda } from "@/hooks/useCrm";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { STATUS_LABELS, STATUS_ORDER, STATUS_COLORS, formatCurrency } from "@/lib/crmTypes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CrmDashboard() {
  const { data: leads = [], isLoading } = useLeads();
  const { data: agenda = [] } = useAgenda();

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const newToday = leads.filter((l) => new Date(l.created_at) >= today).length;
  const hot = leads.filter((l) => l.score >= 75 && !["fechado", "perdido"].includes(l.status)).length;
  const fechados = leads.filter((l) => l.status === "fechado").length;
  const conversao = leads.length ? Math.round((fechados / leads.length) * 100) : 0;
  const upcoming = agenda.filter((a) => !a.concluido && new Date(a.data) >= today).slice(0, 5);

  return (
    <CrmLayout>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do pipeline de vendas</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPI label="Leads totais" value={leads.length} icon={Users} />
        <KPI label="Novos hoje" value={newToday} icon={TrendingUp} />
        <KPI label="Leads quentes" value={hot} icon={Flame} />
        <KPI label="Conversão" value={`${conversao}%`} icon={Building2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Funil de vendas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {STATUS_ORDER.map((s) => {
              const items = leads.filter((l) => l.status === s);
              const pct = leads.length ? (items.length / leads.length) * 100 : 0;
              return (
                <div key={s}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{STATUS_LABELS[s]}</span>
                    <span className="text-muted-foreground">{items.length} leads</span>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><CalendarClock className="h-5 w-5" />Próximos compromissos</CardTitle>
            <Link to="/crm/agenda" className="text-xs text-primary hover:underline">Ver tudo</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Nenhum compromisso próximo.</p>}
            {upcoming.map((a) => (
              <div key={a.id} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{a.titulo}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(a.data), "dd/MM", { locale: ptBR })} {a.hora ? `às ${String(a.hora).slice(0, 5)}` : ""}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Leads recentes</CardTitle></CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}
          <div className="space-y-2">
            {leads.slice(0, 6).map((l) => (
              <Link key={l.id} to={`/crm/leads/${l.id}`} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50">
                <div>
                  <p className="font-medium">{l.nome}</p>
                  <p className="text-xs text-muted-foreground">{l.tipo_imovel || "—"} • {formatCurrency(l.valor_aproximado_imovel)}</p>
                </div>
                <Badge variant="outline" className={STATUS_COLORS[l.status]}>{STATUS_LABELS[l.status]}</Badge>
              </Link>
            ))}
            {!isLoading && leads.length === 0 && <p className="text-sm text-muted-foreground">Nenhum lead cadastrado ainda.</p>}
          </div>
        </CardContent>
      </Card>
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
