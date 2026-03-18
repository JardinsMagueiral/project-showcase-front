import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, DollarSign, ArrowLeft, Building } from "lucide-react";

export default function QuadraDetalhe() {
  const { numero } = useParams<{ numero: string }>();
  const quadra = { numero: parseInt(numero || "1"), nome: `Condomínio Quadra ${String(numero).padStart(2, "0")}`, telefone: "(61) 3333-4444", email: `quadra${numero}@jardinsmangueiral.com`, taxa_condominio: 350 };
  const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <Button variant="ghost" size="sm" className="mb-6" asChild><Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Início</Link></Button>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex aspect-video items-center justify-center rounded-lg bg-muted"><Building className="h-16 w-16 text-muted-foreground" /></div>
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Quadra {String(quadra.numero).padStart(2, "0")}</h1>
              <p className="text-xl text-primary font-semibold mb-6">{quadra.nome}</p>
              <Card><CardContent className="space-y-4 pt-6">
                <div className="flex items-start gap-3"><Phone className="h-5 w-5 text-primary mt-0.5" /><div><p className="text-sm font-medium text-muted-foreground">Telefone(s)</p><p className="font-medium">{quadra.telefone}</p></div></div>
                <div className="flex items-start gap-3"><Mail className="h-5 w-5 text-primary mt-0.5" /><div><p className="text-sm font-medium text-muted-foreground">E-mail</p><a href={`mailto:${quadra.email}`} className="font-medium text-primary hover:underline break-all">{quadra.email}</a></div></div>
                <div className="flex items-start gap-3"><DollarSign className="h-5 w-5 text-primary mt-0.5" /><div><p className="text-sm font-medium text-muted-foreground">Taxa de Condomínio</p><p className="text-2xl font-bold text-primary">{formatCurrency(quadra.taxa_condominio)}</p></div></div>
              </CardContent></Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
