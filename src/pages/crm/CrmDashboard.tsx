import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Clock, Target, Flame, ArrowRight } from "lucide-react";
import { MOCK_LEADS, MOCK_CORRETORES, STATUS_LABELS, STATUS_COLORS } from "@/lib/crmMockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CrmDashboard() {
  const total = MOCK_LEADS.length;
  const ativos = MOCK_LEADS.filter(l => !["fechado","perdido"].includes(l.status)).length;
  const fechados = MOCK_LEADS.filter(l => l.status === "fechado").length;
  const conversao = Math.round((fechados / total) * 100);
  const semContato7d = MOCK_LEADS.filter(l => (Date.now() - new Date(l.ultimoContato).getTime()) / 86400000 > 7).length;
  const quentes = [...MOCK_LEADS].sort((a, b) => b.score - a.score).slice(0, 5);

  const stats = [
    { label: "Leads Ativos", value: ativos, icon: Users, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Taxa de Conversão", value: `${conversao}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { label: "Tempo médio fechamento", value: "32 dias", icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10" },
    { label: "Sem contato 7+ dias", value: semContato7d, icon: Target, color: "text-rose-600", bg: "bg-rose-500/10" },
  ];

  return (
    <CrmLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu CRM</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-2 text-3xl font-bold">{s.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5 text-orange-500" />Leads mais quentes</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to="/crm/leads">Ver todos <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {quentes.map((l) => (
              <Link key={l.id} to={`/crm/leads/${l.id}`} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50">
                <div>
                  <p className="font-medium">{l.nome}</p>
                  <p className="text-xs text-muted-foreground">{l.tipoImovel} • {l.interesse}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={STATUS_COLORS[l.status]}>{STATUS_LABELS[l.status]}</Badge>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="font-bold text-orange-500">{l.score}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Performance por Corretor</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {MOCK_CORRETORES.map((c) => (
              <div key={c.nome} className="rounded-lg border p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{c.nome}</p>
                  <Badge>{c.conversao}% conversão</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Leads:</span> <span className="font-medium">{c.leads}</span></div>
                  <div><span className="text-muted-foreground">Vendas:</span> <span className="font-medium">{c.vendas}</span></div>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary transition-all" style={{ width: `${c.conversao}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Próximas atividades</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {MOCK_LEADS.filter(l => l.proximoFollowUp).slice(0, 5).map(l => (
            <div key={l.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{l.nome}</p>
                <p className="text-xs text-muted-foreground">Follow-up: {format(new Date(l.proximoFollowUp!), "dd 'de' MMM", { locale: ptBR })}</p>
              </div>
              <Button size="sm" variant="outline" asChild><Link to={`/crm/leads/${l.id}`}>Abrir</Link></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </CrmLayout>
  );
}
