import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, Home, Key } from "lucide-react";
import { calcularParcelaPRICE, calcularValorFuturo, formatarMoeda } from "@/lib/calculadoras";

export function ComprarOuAlugar() {
  const [valorAluguel, setValorAluguel] = useState<string>("2500");
  const [valorImovel, setValorImovel] = useState<string>("500000");
  const [taxaJuros, setTaxaJuros] = useState<string>("10.5");
  const [valorizacao, setValorizacao] = useState<number[]>([5]);
  const [prazoAnalise, setPrazoAnalise] = useState<number[]>([10]);

  const resultados = useMemo(() => {
    const aluguel = parseFloat(valorAluguel) || 0;
    const imovel = parseFloat(valorImovel) || 0;
    const taxa = parseFloat(taxaJuros) || 0;
    const valoriz = valorizacao[0];
    const anos = prazoAnalise[0];
    if (aluguel <= 0 || imovel <= 0 || anos <= 0) return null;
    const entrada = imovel * 0.2;
    const financiado = imovel * 0.8;
    const parcela = calcularParcelaPRICE(financiado, taxa, 360);
    let custoAluguelAcumulado = 0;
    let custoCompraAcumulado = entrada;
    let patrimonioCompra = 0;
    for (let ano = 1; ano <= anos; ano++) {
      custoAluguelAcumulado += aluguel * 12 * Math.pow(1.05, ano - 1);
      custoCompraAcumulado += parcela * 12;
      patrimonioCompra = calcularValorFuturo(imovel, valoriz, ano);
    }
    const patrimonioFinalAluguel = calcularValorFuturo(entrada, 8, anos);
    const saldoCompra = patrimonioCompra - custoCompraAcumulado;
    const saldoAluguel = patrimonioFinalAluguel - custoAluguelAcumulado;
    const melhorOpcao = saldoCompra > saldoAluguel ? "comprar" : "alugar";
    return { entrada, parcela, custoTotalAluguel: custoAluguelAcumulado, custoTotalCompra: custoCompraAcumulado, patrimonioFinalCompra: patrimonioCompra, patrimonioFinalAluguel, saldoCompra, saldoAluguel, melhorOpcao };
  }, [valorAluguel, valorImovel, taxaJuros, valorizacao, prazoAnalise]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Dados para Comparação</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Valor do Aluguel Mensal (R$)</Label><Input type="number" value={valorAluguel} onChange={(e) => setValorAluguel(e.target.value)} /></div>
            <div className="space-y-2"><Label>Valor do Imóvel (R$)</Label><Input type="number" value={valorImovel} onChange={(e) => setValorImovel(e.target.value)} /></div>
            <div className="space-y-2"><Label>Taxa de Juros Financiamento (% ao ano)</Label><Input type="number" step="0.1" value={taxaJuros} onChange={(e) => setTaxaJuros(e.target.value)} /></div>
            <div className="space-y-2"><Label>Valorização Anual Estimada: {valorizacao[0]}%</Label><Slider value={valorizacao} onValueChange={setValorizacao} min={0} max={15} step={0.5} className="mt-2" /></div>
            <div className="space-y-2"><Label>Prazo de Análise: {prazoAnalise[0]} anos</Label><Slider value={prazoAnalise} onValueChange={setPrazoAnalise} min={1} max={30} step={1} className="mt-2" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Resultado da Análise</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {resultados ? (
              <>
                <div className={`rounded-lg p-4 text-center ${resultados.melhorOpcao === "comprar" ? "bg-green-500/10 border border-green-500/30" : "bg-blue-500/10 border border-blue-500/30"}`}>
                  <Badge className={`text-lg py-1 px-4 ${resultados.melhorOpcao === "comprar" ? "bg-green-600" : "bg-blue-600"}`}>
                    {resultados.melhorOpcao === "comprar" ? <><Home className="mr-2 h-4 w-4" /> Comprar é mais vantajoso</> : <><Key className="mr-2 h-4 w-4" /> Alugar é mais vantajoso</>}
                  </Badge>
                  <p className="mt-2 text-sm text-muted-foreground">Em {prazoAnalise[0]} anos de análise</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-green-500/10 p-3"><div className="flex items-center gap-2 text-sm text-green-700"><Home className="h-4 w-4" />Comprar</div><div className="mt-1 text-xs text-muted-foreground">Custo: {formatarMoeda(resultados.custoTotalCompra)}</div><div className="mt-1 font-bold text-green-700">Saldo: {formatarMoeda(resultados.saldoCompra)}</div></div>
                  <div className="rounded-lg bg-blue-500/10 p-3"><div className="flex items-center gap-2 text-sm text-blue-700"><Key className="h-4 w-4" />Alugar</div><div className="mt-1 text-xs text-muted-foreground">Custo: {formatarMoeda(resultados.custoTotalAluguel)}</div><div className="mt-1 font-bold text-blue-700">Saldo: {formatarMoeda(resultados.saldoAluguel)}</div></div>
                </div>
              </>
            ) : <p className="text-center text-muted-foreground">Preencha os campos para ver a comparação</p>}
          </CardContent>
        </Card>
      </div>
      <Alert><Info className="h-4 w-4" /><AlertDescription>Esta análise considera cenários simplificados. Fatores como manutenção, condomínio e IPTU podem alterar o resultado.</AlertDescription></Alert>
    </div>
  );
}
