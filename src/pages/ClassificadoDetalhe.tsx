import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Tag } from "lucide-react";

const mockClassificados: { id: string; titulo: string; descricao: string; preco: number; categoria: string; contato_whatsapp: string }[] = [];

export default function ClassificadoDetalhe() {
  const { id } = useParams();
  const item = mockClassificados.find((c) => c.id === id);

  const formatPrice = (price: number) => price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleWhatsApp = () => {
    if (!item) return;
    const msg = encodeURIComponent(`Olá! Vi seu anúncio "${item.titulo}" por ${formatPrice(item.preco)} e tenho interesse!`);
    const phone = item.contato_whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  };

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl px-4">
          <Button variant="ghost" className="mb-4" asChild>
            <Link to="/classificados"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
          </Button>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
              <Tag className="h-16 w-16 text-muted-foreground/30" />
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
