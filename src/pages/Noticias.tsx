import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, MessageCircle, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Noticias() {
  const { data: noticias = [], isLoading } = useQuery({
    queryKey: ["noticias-publicas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("noticias")
        .select("*")
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
            <Newspaper className="mx-auto mb-4 h-12 w-12" />
            <h1 className="font-serif text-4xl font-bold md:text-5xl">Notícias</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">Novidades e informações da comunidade</p>
          </div>
        </section>
        <section className="bg-secondary/50 py-12">
          <div className="container px-4">
            <h2 className="font-serif text-2xl font-bold mb-6">Notícias da Comunidade</h2>
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-48 rounded-lg" />)}
              </div>
            ) : noticias.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma notícia publicada ainda.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {noticias.map((n) => (
                  <a key={n.id} href={n.link || "#"} target={n.link ? "_blank" : undefined} rel="noopener noreferrer" className="block">
                    <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                      {n.imagem_url && <img src={n.imagem_url} alt={n.titulo} className="h-36 w-full object-cover" loading="lazy" />}
                      <CardContent className="p-4 flex flex-col justify-between">
                        <h3 className="font-medium text-sm leading-snug line-clamp-3">{n.titulo}</h3>
                        {n.descricao && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{n.descricao}</p>}
                        {n.link && (
                          <div className="mt-3 flex items-center justify-end">
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
        <section className="py-12">
          <div className="container px-4 text-center">
            <h2 className="font-serif text-2xl font-bold mb-4">Fique Conectado</h2>
            <p className="text-muted-foreground mb-6">Entre no grupo geral do WhatsApp para receber notícias em tempo real</p>
            <Button variant="whatsapp" size="lg" asChild>
              <a href="https://chat.whatsapp.com/GH1XuLDJfKP4be24ullSCD" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" /> Grupo Geral do WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
