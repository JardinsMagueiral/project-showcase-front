import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bed, Bath, Car, Maximize, ArrowRight, Building, ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function FeaturedProperties() {
  const [showAll, setShowAll] = useState(false);
  const [tipo, setTipo] = useState("");
  const [operacao, setOperacao] = useState("");
  const [quartos, setQuartos] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");

  const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(price);

  const { data: imoveis = [], isLoading } = useQuery({
    queryKey: ["imoveis-recentes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("imoveis")
        .select("*, imovel_fotos(url, ordem)")
        .eq("status", "aprovado")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredImoveis = useMemo(() => {
    if (!showAll) return imoveis;
    return imoveis.filter((imovel) => {
      if (tipo && imovel.tipo !== tipo) return false;
      if (operacao && imovel.operacao !== operacao) return false;
      if (quartos && (imovel.quartos ?? 0) < Number(quartos)) return false;
      if (banheiros && (imovel.banheiros ?? 0) < Number(banheiros)) return false;
      if (precoMin && imovel.preco < Number(precoMin)) return false;
      if (precoMax && imovel.preco > Number(precoMax)) return false;
      return true;
    });
  }, [imoveis, showAll, tipo, operacao, quartos, banheiros, precoMin, precoMax]);

  const hasActiveFilters = tipo || operacao || quartos || banheiros || precoMin || precoMax;

  const clearFilters = () => {
    setTipo("");
    setOperacao("");
    setQuartos("");
    setBanheiros("");
    setPrecoMin("");
    setPrecoMax("");
  };

  if (isLoading) {
    return (
      <section className="bg-muted/50 py-16">
        <div className="container px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-72 rounded-lg" />)}
          </div>
        </div>
      </section>
    );
  }

  if (imoveis.length === 0) return null;

  const visibleImoveis = showAll ? filteredImoveis : imoveis.slice(0, 16);
  const hasMore = imoveis.length > 16;

  return (
    <section className="bg-muted/50 py-16">
      <div className="container px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground">Imóveis Disponíveis</h2>
            <p className="mt-2 text-muted-foreground">Confira as oportunidades mais recentes do Jardins Mangueiral</p>
          </div>
          <Button variant="outline" asChild className="hidden md:flex">
            <Link to="/imoveis">Ver Todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        {showAll && (
          <div className="mb-6 rounded-lg border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <SlidersHorizontal className="h-4 w-4" /> Filtrar Imóveis
              </h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  <X className="mr-1 h-3 w-3" /> Limpar filtros
                </Button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <Select value={tipo} onValueChange={(v) => setTipo(v === "todos" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="kitnet">Kitnet</SelectItem>
                </SelectContent>
              </Select>
              <Select value={operacao} onValueChange={(v) => setOperacao(v === "todas" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Operação" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="aluguel">Aluguel</SelectItem>
                </SelectContent>
              </Select>
              <Select value={quartos} onValueChange={(v) => setQuartos(v === "todos" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Quartos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Quartos</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
              <Select value={banheiros} onValueChange={(v) => setBanheiros(v === "todos" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Banheiros" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Banheiros</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Preço mín." value={precoMin} onChange={(e) => setPrecoMin(e.target.value)} />
              <Input type="number" placeholder="Preço máx." value={precoMax} onChange={(e) => setPrecoMax(e.target.value)} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {filteredImoveis.length} imóvel(is) encontrado(s)
            </p>
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleImoveis.map((imovel) => {
            const foto = imovel.imovel_fotos?.sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0))[0];
            return (
              <Link key={imovel.id} to={`/imoveis/${imovel.id}`}>
                <Card className="group overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {foto ? <img src={foto.url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted-foreground"><Building className="h-12 w-12" /></div>}
                    <Badge className="absolute left-3 top-3" variant={imovel.operacao === "venda" ? "default" : "secondary"}>
                      {imovel.operacao === "venda" ? "Venda" : "Aluguel"}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm capitalize text-muted-foreground">{imovel.tipo}</p>
                    <p className="mt-1 text-xl font-bold text-primary">
                      {formatPrice(imovel.preco)}
                      {imovel.operacao === "aluguel" && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
                    </p>
                    <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">{imovel.endereco}, {imovel.bairro}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {imovel.quartos}</span>
                      <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {imovel.banheiros}</span>
                      <span className="flex items-center gap-1"><Car className="h-4 w-4" /> {imovel.vagas}</span>
                      {imovel.area_m2 && <span className="flex items-center gap-1"><Maximize className="h-4 w-4" /> {imovel.area_m2}m²</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
        {hasMore && (
          <div className="mt-8 text-center">
            {showAll ? (
              <Button variant="outline" size="lg" onClick={() => { setShowAll(false); clearFilters(); }}>
                Mostrar Menos <ChevronUp className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button variant="outline" size="lg" onClick={() => setShowAll(true)}>
                Mostrar Mais <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        <div className="mt-6 text-center md:hidden">
          <Button variant="outline" asChild><Link to="/imoveis">Ver Todos os Imóveis <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </div>
    </section>
  );
}
