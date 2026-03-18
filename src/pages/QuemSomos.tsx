import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Users, Heart, Target, Sparkles } from "lucide-react";

const QuemSomos = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="container px-4 text-center">
            <h1 className="font-serif text-4xl font-bold md:text-5xl">Quem Somos</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">Nossa história, propósito e por que essa comunidade existe</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container max-w-4xl px-4">
            <p className="text-xl text-muted-foreground leading-relaxed">
              O <strong>Jardins Mangueiral</strong> é mais do que um bairro em Brasília - é uma comunidade vibrante onde vizinhos se tornam amigos e juntos construímos um lugar melhor para viver.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {[
                { icon: Heart, title: "Nossa Missão", text: "Conectar moradores, fortalecer vínculos e criar uma rede de apoio mútuo que transforma vizinhos em uma verdadeira família." },
                { icon: Target, title: "Nossa Visão", text: "Ser a principal plataforma de conexão comunitária do Jardins Mangueiral, facilitando a vida de todos os moradores." },
                { icon: Users, title: "Comunidade", text: "Milhares de moradores conectados através de grupos de WhatsApp, eventos locais e iniciativas comunitárias." },
                { icon: Sparkles, title: "Iniciativa", text: "Projeto idealizado por Luciana Nepomuceno, moradora apaixonada pelo bairro e dedicada à comunidade." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-secondary p-6">
                  <item.icon className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QuemSomos;
