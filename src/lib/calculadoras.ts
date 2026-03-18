export interface ParcelaSAC {
  mes: number;
  parcela: number;
  amortizacao: number;
  juros: number;
  saldoDevedor: number;
}

export function calcularParcelaPRICE(valorFinanciado: number, taxaAnual: number, prazoMeses: number): number {
  const taxaMensal = taxaAnual / 100 / 12;
  if (taxaMensal === 0) return valorFinanciado / prazoMeses;
  return valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, prazoMeses)) / (Math.pow(1 + taxaMensal, prazoMeses) - 1);
}

export function calcularParcelasSAC(valorFinanciado: number, taxaAnual: number, prazoMeses: number): ParcelaSAC[] {
  const taxaMensal = taxaAnual / 100 / 12;
  const amortizacao = valorFinanciado / prazoMeses;
  const parcelas: ParcelaSAC[] = [];
  let saldoDevedor = valorFinanciado;
  for (let mes = 1; mes <= prazoMeses; mes++) {
    const juros = saldoDevedor * taxaMensal;
    parcelas.push({ mes, parcela: amortizacao + juros, amortizacao, juros, saldoDevedor });
    saldoDevedor -= amortizacao;
  }
  return parcelas;
}

export function calcularParcelasPRICE(valorFinanciado: number, taxaAnual: number, prazoMeses: number): ParcelaSAC[] {
  const taxaMensal = taxaAnual / 100 / 12;
  const parcelaFixa = calcularParcelaPRICE(valorFinanciado, taxaAnual, prazoMeses);
  const parcelas: ParcelaSAC[] = [];
  let saldoDevedor = valorFinanciado;
  for (let mes = 1; mes <= prazoMeses; mes++) {
    const juros = saldoDevedor * taxaMensal;
    const amortizacao = parcelaFixa - juros;
    parcelas.push({ mes, parcela: parcelaFixa, amortizacao, juros, saldoDevedor });
    saldoDevedor -= amortizacao;
  }
  return parcelas;
}

export function calcularValorFuturo(valorPresente: number, taxaAnual: number, anos: number): number {
  return valorPresente * Math.pow(1 + taxaAnual / 100, anos);
}

export function calcularValorMaximoFinanciamento(parcelaMaxima: number, taxaAnual: number, prazoMeses: number): number {
  const taxaMensal = taxaAnual / 100 / 12;
  if (taxaMensal === 0) return parcelaMaxima * prazoMeses;
  return parcelaMaxima * (Math.pow(1 + taxaMensal, prazoMeses) - 1) / (taxaMensal * Math.pow(1 + taxaMensal, prazoMeses));
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}
