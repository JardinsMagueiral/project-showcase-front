import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MessageCircle, Bed, Bath, Car, Maximize, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ImovelDetalhe() {
  const { id } = useParams<{ id: string }>();
  const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const { data: imovel, isLoading } = useQuery({
    queryKey: ["imovel", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("imoveis")
        .select("*, imovel_fotos(id, url, ordem)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 py-8"><div className="container px-4"><Skeleton className="h-96" /></div></main>
        <Footer />
      </div>
    );
  }

  if (!imovel) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-lg text-muted-foreground">Imóvel não encontrado</p>
          <Button asChild><Link to="/imoveis">Voltar</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const fotos = (imovel.imovel_fotos || []).sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <Button variant="ghost" asChild><Link to="/imoveis"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Imóveis</Link></Button>
          <div className="mt-6 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {fotos.length > 0 ? (
                <div className="grid gap-2">
                  <img src={fotos[0].url} alt="" className="aspect-video w-full rounded-lg object-cover" />
                  {fotos.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {fotos.slice(1).map((f: any) => (
                        <img key={f.id} src={f.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg bg-muted"><p className="text-muted-foreground">Sem fotos disponíveis</p></div>
              )}
              <Card className="mt-8"><CardContent className="p-6"><h2 className="mb-4 text-xl font-semibold">Descrição</h2><p className="whitespace-pre-wrap text-muted-foreground">{imovel.descricao || "Sem descrição"}</p></CardContent></Card>
            </div>
            <div className="space-y-6">
              <Card><CardContent className="p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2"><Badge className="capitalize">{imovel.operacao}</Badge><Badge variant="outline" className="capitalize">{imovel.tipo}</Badge></div>
                <h1 className="mb-2 font-serif text-2xl font-bold capitalize">{imovel.tipo} para {imovel.operacao}</h1>
                <div className="mb-4 flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /><span>{imovel.endereco}, {imovel.bairro}</span></div>
                <p className="text-3xl font-bold text-primary">{formatPrice(imovel.preco)}</p>
              </CardContent></Card>
              <Card><CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Características</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2"><Bed className="h-5 w-5 text-muted-foreground" /><span>{imovel.quartos} quartos</span></div>
                  <div className="flex items-center gap-2"><Bath className="h-5 w-5 text-muted-foreground" /><span>{imovel.banheiros} banheiros</span></div>
                  <div className="flex items-center gap-2"><Car className="h-5 w-5 text-muted-foreground" /><span>{imovel.vagas} vagas</span></div>
                  {imovel.area_m2 && <div className="flex items-center gap-2"><Maximize className="h-5 w-5 text-muted-foreground" /><span>{imovel.area_m2} m²</span></div>}
                </div>
              </CardContent></Card>
              <Button variant="whatsapp" size="lg" className="w-full" asChild>
                <a href="https://wa.me/5561991647984" target="_blank"><MessageCircle className="mr-2 h-5 w-5" /> Falar no WhatsApp</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
