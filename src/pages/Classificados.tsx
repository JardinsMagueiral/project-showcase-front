import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formatPrice = (price: number) => price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Classificados() {
  const { data: classificados = [], isLoading } = useQuery({
    queryKey: ["classificados-publicos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classificados")
        .select("*, classificado_fotos(url, ordem)")
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
        <section className="bg-primary/5 py-12">
          <div className="container px-4 text-center">
            <Tag className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h1 className="font-serif text-3xl font-bold md:text-4xl">Desapegos</h1>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">Compre e venda itens com seus vizinhos do Jardins Mangueiral</p>
          </div>
        </section>
        <section className="py-8">
          <div className="container px-4">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 rounded-lg" />)}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {classificados.map((item) => {
                  const foto = item.classificado_fotos?.sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0))[0];
                  return (
                    <Link key={item.id} to={`/classificados/${item.id}`}>
                      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                        <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center">
                          {foto ? <img src={foto.url} alt={item.titulo} className="h-full w-full object-cover" /> : <Tag className="h-12 w-12 text-muted-foreground/30" />}
                        </div>
                        <CardContent className="p-4">
                          <p className="text-lg font-bold text-primary">{formatPrice(item.preco)}</p>
                          <h3 className="mt-1 line-clamp-2 font-medium">{item.titulo}</h3>
                          <Badge variant="secondary" className="mt-2">{item.categoria}</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
