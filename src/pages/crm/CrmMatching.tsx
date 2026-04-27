import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Building2, Send, Bell } from "lucide-react";
import { MOCK_LEADS } from "@/lib/crmMockData";

const MATCHES = [
  {
    imovel: { titulo: "Casa Quadra 8 - 3 suítes - 180m²", preco: 1100000, quartos: 3, area: 180 },
    leads: [
      { nome: "Mariana Costa", score: 92, motivo: "Faixa de preço, localização e quartos compatíveis" },
      { nome: "Pedro Henrique", score: 78, motivo: "Tipo e quartos compatíveis" },
    ],
  },
  {
    imovel: { titulo: "Apto Quadra 12 - 2 dorms - 75m²", preco: 580000, quartos: 2, area: 75 },
    leads: [
      { nome: "Roberto Almeida", score: 95, motivo: "Perfil investidor + faixa de preço ideal" },
    ],
  },
  {
    imovel: { titulo: "Cobertura Q1 - 4 suítes - 280m²", preco: 1900000, quartos: 4, area: 280 },
    leads: [
      { nome: "Pedro Henrique", score: 85, motivo: "Alto padrão + 4 quartos" },
    ],
  },
];

export default function CrmMatching() {
  return (
    <CrmLayout>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-amber-500" />Ofertas Inteligentes
        </h1>
        <p className="text-muted-foreground">Matching automático entre imóveis e clientes</p>
      </div>

      <Card className="mb-6 border-primary/30 bg-primary/5">
        <CardContent className="p-5 flex items-center gap-4">
          <Bell className="h-8 w-8 text-primary shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">3 novos imóveis com matches encontrados nas últimas 24h</p>
            <p className="text-sm text-muted-foreground">Sistema sugere envios automáticos. Histórico de envios é considerado para evitar repetições.</p>
          </div>
          <Button>Notificar todos</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {MATCHES.map((m, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{m.imovel.titulo}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      R$ {m.imovel.preco.toLocaleString("pt-BR")} • {m.imovel.quartos} quartos • {m.imovel.area} m²
                    </p>
                  </div>
                </div>
                <Badge>{m.leads.length} match{m.leads.length > 1 ? "es" : ""}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {m.leads.map(l => (
                <div key={l.nome} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{l.nome}</p>
                      <Badge variant="outline">Score {l.score}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{l.motivo}</p>
                  </div>
                  <Button size="sm"><Send className="mr-2 h-4 w-4" />Enviar imóvel</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </CrmLayout>
  );
}
