import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useSearchParams } from "react-router-dom";
import { Building, MessageCircle, Key, Bed, Bath, Car, Maximize } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

const Imoveis = () => {
  const [searchParams] = useSearchParams();
  const { data: imoveis = [], isLoading } = useQuery({
    queryKey: ["imoveis-publicos"],
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container px-4 text-center">
            <Building className="mx-auto mb-4 h-12 w-12" />
            <h1 className="font-serif text-4xl font-bold md:text-5xl">Morar & Viver Aqui</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">Encontre seu lar no Jardins Mangueiral ou anuncie seu imóvel</p>
            <div className="mt-8"><Button size="lg" variant="secondary" asChild><Link to="/contato"><Key className="mr-2 h-5 w-5" /> Cadastrar Imóvel</Link></Button></div>
          </div>
        </section>
        <section className="py-12">
          <div className="container px-4">
            <p className="mb-6 text-muted-foreground">{filteredImoveis.length} imóveis encontrados</p>
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-72 rounded-lg" />)}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {imoveis.map((imovel) => {
                  const foto = imovel.imovel_fotos?.sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0))[0];
                  return (
                    <Link key={imovel.id} to={`/imoveis/${imovel.id}`}>
                      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                        <div className="relative aspect-video bg-muted flex items-center justify-center">
                          {foto ? <img src={foto.url} alt="" className="h-full w-full object-cover" /> : <Building className="h-12 w-12 text-muted-foreground" />}
                          <Badge className="absolute left-2 top-2 capitalize">{imovel.operacao}</Badge>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-2xl font-bold text-primary">{formatPrice(imovel.preco)}{imovel.operacao === "aluguel" && <span className="text-sm font-normal text-muted-foreground">/mês</span>}</p>
                          <h3 className="mt-1 font-semibold capitalize">{imovel.tipo}</h3>
                          <p className="text-sm text-muted-foreground">{imovel.endereco}, {imovel.bairro}</p>
                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {imovel.quartos}</span>
                            <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {imovel.banheiros}</span>
                            <span className="flex items-center gap-1"><Car className="h-4 w-4" /> {imovel.vagas}</span>
                            {imovel.area_m2 && <span className="flex items-center gap-1"><Maximize className="h-4 w-4" /> {imovel.area_m2} m²</span>}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        <section className="bg-secondary py-16">
          <div className="container px-4 text-center">
            <h2 className="font-serif text-3xl font-bold">Quer anunciar seu imóvel?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Crie sua conta gratuitamente e anuncie seu imóvel para milhares de pessoas.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild><Link to="/login"><Key className="mr-2 h-5 w-5" /> Criar Conta</Link></Button>
              <Button size="lg" variant="whatsapp" asChild><a href="https://wa.me/5561991647984" target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-5 w-5" /> Fale Conosco</a></Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Imoveis;
