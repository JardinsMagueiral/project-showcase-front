import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Users, Award } from "lucide-react";
import { MOCK_LEADS, MOCK_CORRETORES, STATUS_LABELS, type LeadStatus } from "@/lib/crmMockData";

const ORDER: LeadStatus[] = ["novo", "atendimento", "proposta", "fechado", "perdido"];

export default function CrmMetricas() {
  const total = MOCK_LEADS.length;
  const fechados = MOCK_LEADS.filter(l => l.status === "fechado").length;
  const conversao = Math.round((fechados / total) * 100);
  const ativos = MOCK_LEADS.filter(l => !["fechado","perdido"].includes(l.status)).length;
  const inativos = total - ativos;

  return (
    <CrmLayout>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold">Métricas & Relatórios</h1>
        <p className="text-muted-foreground">Acompanhe a saúde do seu pipeline</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          { l: "Conversão", v: `${conversao}%`, i: TrendingUp, c: "text-emerald-600 bg-emerald-500/10" },
          { l: "Tempo médio fechamento", v: "32 dias", i: Clock, c: "text-amber-600 bg-amber-500/10" },
          { l: "Ativos / Inativos", v: `${ativos} / ${inativos}`, i: Users, c: "text-blue-600 bg-blue-500/10" },
          { l: "Top corretor", v: "Ana L.", i: Award, c: "text-purple-600 bg-purple-500/10" },
        ].map(s => (
          <Card key={s.l}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.l}</p>
                  <p className="mt-2 text-2xl font-bold">{s.v}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.c}`}>
                  <s.i className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Distribuição por etapa do funil</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {ORDER.map(s => {
              const count = MOCK_LEADS.filter(l => l.status === s).length;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{STATUS_LABELS[s]}</span>
                    <span className="text-muted-foreground">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ranking — leads mais quentes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[...MOCK_LEADS].sort((a, b) => b.score - a.score).slice(0, 6).map((l, idx) => (
              <div key={l.id} className="flex items-center gap-3 rounded-lg border p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{idx + 1}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{l.nome}</p>
                  <p className="text-xs text-muted-foreground">{l.tipoImovel} • {l.responsavel}</p>
                </div>
                <Badge>Score {l.score}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Performance por corretor</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {MOCK_CORRETORES.map(c => (
            <div key={c.nome} className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{c.nome}</p>
                <Badge>{c.conversao}% conversão</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div><p className="text-muted-foreground">Leads</p><p className="font-bold text-lg">{c.leads}</p></div>
                <div><p className="text-muted-foreground">Vendas</p><p className="font-bold text-lg">{c.vendas}</p></div>
                <div><p className="text-muted-foreground">Conversão</p><p className="font-bold text-lg">{c.conversao}%</p></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </CrmLayout>
  );
}
