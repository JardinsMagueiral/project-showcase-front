import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Wallet, Home, DollarSign } from "lucide-react";
import { calcularValorMaximoFinanciamento, formatarMoeda } from "@/lib/calculadoras";

export function QuantoPossoFinanciar() {
  const [rendaMensal, setRendaMensal] = useState("10000");
  const [percentualComprometido, setPercentualComprometido] = useState([30]);
  const [taxaJuros, setTaxaJuros] = useState("10.5");
  const [prazoAnos, setPrazoAnos] = useState([30]);

  const resultados = useMemo(() => {
    const renda = parseFloat(rendaMensal) || 0;
    const percentual = percentualComprometido[0];
    const taxa = parseFloat(taxaJuros) || 0;
    const prazoMeses = prazoAnos[0] * 12;
    if (renda <= 0 || prazoMeses <= 0) return null;
    const parcelaMaxima = (renda * percentual) / 100;
    const valorMaximoFinanciamento = calcularValorMaximoFinanciamento(parcelaMaxima, taxa, prazoMeses);
    const valorImovelEstimado = valorMaximoFinanciamento / 0.8;
    return { parcelaMaxima, valorMaximoFinanciamento, valorImovelEstimado };
  }, [rendaMensal, percentualComprometido, taxaJuros, prazoAnos]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Sua Situação Financeira</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Renda Mensal Familiar (R$)</Label><Input type="number" value={rendaMensal} onChange={(e) => setRendaMensal(e.target.value)} /></div>
            <div className="space-y-2"><Label>Percentual Máximo: {percentualComprometido[0]}%</Label><Slider value={percentualComprometido} onValueChange={setPercentualComprometido} min={20} max={35} step={1} /></div>
            <div className="space-y-2"><Label>Taxa de Juros (% ao ano)</Label><Input type="number" step="0.1" value={taxaJuros} onChange={(e) => setTaxaJuros(e.target.value)} /></div>
            <div className="space-y-2"><Label>Prazo: {prazoAnos[0]} anos</Label><Slider value={prazoAnos} onValueChange={setPrazoAnos} min={5} max={35} step={1} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Capacidade de Financiamento</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {resultados ? (
              <>
                <div className="rounded-lg bg-secondary p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Wallet className="h-4 w-4" /> Parcela Máxima</div><div className="mt-1 text-2xl font-bold">{formatarMoeda(resultados.parcelaMaxima)}</div></div>
                <div className="rounded-lg bg-primary/10 p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><DollarSign className="h-4 w-4" /> Valor Máximo Financiamento</div><div className="mt-1 text-2xl font-bold text-primary">{formatarMoeda(resultados.valorMaximoFinanciamento)}</div></div>
                <div className="rounded-lg bg-accent p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Home className="h-4 w-4" /> Valor Aproximado do Imóvel</div><div className="mt-1 text-2xl font-bold text-accent-foreground">{formatarMoeda(resultados.valorImovelEstimado)}</div><p className="mt-1 text-xs text-muted-foreground">Considerando entrada de 20%</p></div>
              </>
            ) : <p className="text-center text-muted-foreground">Preencha os campos</p>}
          </CardContent>
        </Card>
      </div>
      <Alert><Info className="h-4 w-4" /><AlertDescription>Estimativa baseada na sua renda declarada.</AlertDescription></Alert>
    </div>
  );
}
