import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Car, Maximize, ArrowRight } from "lucide-react";

const mockImoveis = [
  { id: "1", tipo: "casa", operacao: "venda", endereco: "Quadra 01, Conjunto A", bairro: "Jardins Mangueiral", preco: 450000, quartos: 3, banheiros: 2, vagas: 2, area_m2: 120 },
  { id: "2", tipo: "apartamento", operacao: "aluguel", endereco: "Quadra 05, Bloco B", bairro: "Jardins Mangueiral", preco: 2500, quartos: 2, banheiros: 1, vagas: 1, area_m2: 65 },
  { id: "3", tipo: "casa", operacao: "venda", endereco: "Quadra 08, Conjunto C", bairro: "Jardins Mangueiral", preco: 380000, quartos: 2, banheiros: 2, vagas: 1, area_m2: 90 },
];

export function FeaturedProperties() {
  const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(price);

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
          {mockImoveis.map((imovel) => (
            <Link key={imovel.id} to={`/imoveis/${imovel.id}`}>
              <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <div className="flex h-full items-center justify-center text-muted-foreground"><Maximize className="h-12 w-12" /></div>
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
          ))}
        </div>
        <div className="mt-6 text-center md:hidden">
          <Button variant="outline" asChild><Link to="/imoveis">Ver Todos os Imóveis <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </div>
    </section>
  );
}
