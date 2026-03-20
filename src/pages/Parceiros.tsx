import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Wrench, Building2, UserPlus, MessageCircle, Phone } from "lucide-react";

const mockParceiros: { id: string; nome: string; categoria: string; descricao: string; telefone: string }[] = [];

const Parceiros = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container px-4 text-center">
            <Handshake className="mx-auto mb-4 h-12 w-12" />
            <h1 className="font-serif text-4xl font-bold md:text-5xl">Parceiros e Indicações</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">Prestadores de serviços e empresas parceiras da comunidade</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container px-4">
            <h2 className="mb-8 text-center font-serif text-3xl font-bold">Parceiros da Comunidade</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockParceiros.map((p) => (
                <Card key={p.id} className="transition-all hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{p.nome}</CardTitle>
                    <CardDescription>{p.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="whatsapp" size="sm" asChild>
                      <a href={`https://wa.me/55${p.telefone}`} target="_blank" rel="noopener noreferrer">
                        <Phone className="mr-1 h-4 w-4" /> WhatsApp
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 bg-muted/50">
          <div className="container px-4">
            <h2 className="mb-8 text-center font-serif text-3xl font-bold">Precisa de Ajuda?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Wrench, title: "Prestadores de Serviços", desc: "Eletricistas, encanadores, diaristas e mais" },
                { icon: Building2, title: "Empresas Parceiras", desc: "Lojas e empresas da região com descontos" },
                { icon: UserPlus, title: "Indique um Profissional", desc: "Conhece alguém de confiança? Indique!" },
              ].map((item) => (
                <Card key={item.title} className="text-center transition-all hover:shadow-lg">
                  <CardHeader>
                    <item.icon className="mx-auto mb-2 h-10 w-10 text-primary" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="whatsapp" className="w-full" asChild>
                      <a href="https://wa.me/5561991647984" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" /> Solicitar
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Parceiros;
