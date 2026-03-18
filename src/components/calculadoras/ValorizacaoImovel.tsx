import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, TrendingUp, Coins } from "lucide-react";
import { calcularValorFuturo, formatarMoeda } from "@/lib/calculadoras";

export function ValorizacaoImovel() {
  const [valorAtual, setValorAtual] = useState<string>("500000");
  const [taxaValorizacao, setTaxaValorizacao] = useState<number[]>([5]);
  const [prazoAnos, setPrazoAnos] = useState<number[]>([10]);

  const resultados = useMemo(() => {
    const valor = parseFloat(valorAtual) || 0;
    const taxa = taxaValorizacao[0];
    const anos = prazoAnos[0];
    if (valor <= 0 || anos <= 0) return null;
    const valorFinal = calcularValorFuturo(valor, taxa, anos);
    const ganhoTotal = valorFinal - valor;
    const percentualTotal = ((valorFinal - valor) / valor) * 100;
    return { valorFinal, ganhoTotal, percentualTotal };
  }, [valorAtual, taxaValorizacao, prazoAnos]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Dados do Imóvel</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Valor Atual do Imóvel (R$)</Label><Input type="number" value={valorAtual} onChange={(e) => setValorAtual(e.target.value)} /></div>
            <div className="space-y-2"><Label>Taxa de Valorização Anual: {taxaValorizacao[0]}%</Label><Slider value={taxaValorizacao} onValueChange={setTaxaValorizacao} min={0} max={15} step={0.5} className="mt-2" /><p className="text-xs text-muted-foreground">Média histórica no Brasil: 3% a 8% ao ano</p></div>
            <div className="space-y-2"><Label>Prazo de Projeção: {prazoAnos[0]} anos</Label><Slider value={prazoAnos} onValueChange={setPrazoAnos} min={1} max={30} step={1} className="mt-2" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Projeção de Valorização</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {resultados ? (
              <>
                <div className="rounded-lg bg-primary/10 p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><TrendingUp className="h-4 w-4" />Valor Futuro Estimado</div><div className="mt-1 text-2xl font-bold text-primary">{formatarMoeda(resultados.valorFinal)}</div><p className="text-sm text-muted-foreground">Em {prazoAnos[0]} anos</p></div>
                <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4"><div className="flex items-center gap-2 text-sm text-green-700"><Coins className="h-4 w-4" />Ganho Patrimonial</div><div className="mt-1 text-2xl font-bold text-green-700">+ {formatarMoeda(resultados.ganhoTotal)}</div><p className="text-sm text-green-600">+{resultados.percentualTotal.toFixed(1)}% de valorização</p></div>
                <div className="rounded-lg border p-3"><h4 className="text-sm font-medium">Resumo</h4><div className="mt-2 grid grid-cols-2 gap-2 text-sm"><div><span className="text-muted-foreground">Valor inicial:</span><div className="font-medium">{formatarMoeda(parseFloat(valorAtual) || 0)}</div></div><div><span className="text-muted-foreground">Valor final:</span><div className="font-medium">{formatarMoeda(resultados.valorFinal)}</div></div><div><span className="text-muted-foreground">Taxa a.a.:</span><div className="font-medium">{taxaValorizacao[0]}%</div></div><div><span className="text-muted-foreground">Período:</span><div className="font-medium">{prazoAnos[0]} anos</div></div></div></div>
              </>
            ) : <p className="text-center text-muted-foreground">Preencha os campos para ver a projeção</p>}
          </CardContent>
        </Card>
      </div>
      <Alert><Info className="h-4 w-4" /><AlertDescription>Esta projeção é baseada em uma taxa de valorização constante e não considera variações de mercado.</AlertDescription></Alert>
    </div>
  );
}
