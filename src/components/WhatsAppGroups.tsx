import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function WhatsAppGroups() {
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["whatsapp-grupos-publicos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_grupos")
        .select("*")
        .eq("ativo", true)
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-lg" />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Entre para a Comunidade</h2>
          <p className="mt-4 text-lg text-muted-foreground">Conecte-se com seus vizinhos nos nossos grupos do WhatsApp</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {groups.map((group) => (
            <Card key={group.id} className="group transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{group.titulo}</CardTitle>
                <CardDescription>{group.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="whatsapp" className="w-full" asChild>
                  <a href={group.link} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> Entrar no Grupo
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
