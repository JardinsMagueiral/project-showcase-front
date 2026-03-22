import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MessageCircle, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ClassificadoDetalhe() {
  const { id } = useParams();
  const formatPrice = (price: number) => price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const { data: item, isLoading } = useQuery({
    queryKey: ["classificado", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classificados")
        .select("*, classificado_fotos(id, url, ordem)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleWhatsApp = () => {
    if (!item) return;
    const msg = encodeURIComponent(`Olá! Vi seu anúncio "${item.titulo}" por ${formatPrice(item.preco)} e tenho interesse!`);
    const phone = item.contato_whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 py-8"><div className="container px-4"><Skeleton className="h-96" /></div></main>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-lg text-muted-foreground">Anúncio não encontrado</p>
          <Button asChild><Link to="/classificados">Voltar aos anúncios</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const fotos = (item.classificado_fotos || []).sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl px-4">
          <Button variant="ghost" className="mb-4" asChild>
            <Link to="/classificados"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
          </Button>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted flex items-center justify-center">
              {fotos.length > 0 ? <img src={fotos[0].url} alt={item.titulo} className="h-full w-full object-cover" /> : <Tag className="h-16 w-16 text-muted-foreground/30" />}
            </div>
            <div className="space-y-4">
              <div>
                <Badge variant="secondary">{item.categoria}</Badge>
                <h1 className="mt-2 font-serif text-2xl font-bold">{item.titulo}</h1>
                <p className="mt-1 text-3xl font-bold text-primary">{formatPrice(item.preco)}</p>
              </div>
              {item.descricao && (
                <Card>
                  <CardContent className="p-4">
                    <h2 className="mb-2 font-semibold">Descrição</h2>
                    <p className="whitespace-pre-line text-muted-foreground">{item.descricao}</p>
                  </CardContent>
                </Card>
              )}
              <Button variant="whatsapp" size="lg" className="w-full" onClick={handleWhatsApp}>
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar com o Vendedor
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
