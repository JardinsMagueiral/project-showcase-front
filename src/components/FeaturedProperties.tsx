import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bed, Bath, Car, Maximize, ArrowRight, Building } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function FeaturedProperties() {
  const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(price);

  const { data: imoveis = [], isLoading } = useQuery({
    queryKey: ["imoveis-destaque"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("imoveis")
        .select("*, imovel_fotos(url, ordem)")
        .eq("status", "aprovado")
        .eq("destaque", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="bg-muted/50 py-16">
        <div className="container px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-72 rounded-lg" />)}
          </div>
        </div>
      </section>
    );
  }

  if (imoveis.length === 0) return null;

  return (
    <section className="bg-muted/50 py-16">
      <div className="container px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground">Imóveis em Destaque</h2>
            <p className="mt-2 text-muted-foreground">Confira as melhores oportunidades do Jardins Mangueiral</p>
          </div>
          <Button variant="outline" asChild className="hidden md:flex">
            <Link to="/imoveis">Ver Todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {imoveis.map((imovel) => {
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
        <div className="mt-6 text-center md:hidden">
          <Button variant="outline" asChild><Link to="/imoveis">Ver Todos os Imóveis <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </div>
    </section>
  );
}
