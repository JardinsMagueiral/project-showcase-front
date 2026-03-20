import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const groups: { id: string; titulo: string; descricao: string; link: string }[] = [];

export function WhatsAppGroups() {
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
