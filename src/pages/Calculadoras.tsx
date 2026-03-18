import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Wallet, Receipt, PiggyBank, Home, Key, TrendingUp } from "lucide-react";
import { SimuladorFinanciamento } from "@/components/calculadoras/SimuladorFinanciamento";
import { QuantoPossoFinanciar } from "@/components/calculadoras/QuantoPossoFinanciar";

const calculadoras = [
  { id: "financiamento", titulo: "Simulador de Financiamento", icon: Calculator },
  { id: "quanto-posso", titulo: "Quanto Posso Financiar?", icon: Wallet },
];

export default function Calculadoras() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-secondary/30 to-background py-12">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3"><Calculator className="h-8 w-8 text-primary" /></div>
              <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Calculadoras Financeiras</h1>
              <p className="mt-4 text-lg text-muted-foreground">Ferramentas práticas para ajudar você a planejar a compra do seu imóvel</p>
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container px-4">
            <Tabs defaultValue="financiamento" className="space-y-8">
              <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
                {calculadoras.map((calc) => (
                  <TabsTrigger key={calc.id} value={calc.id} className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                    <calc.icon className="h-4 w-4" /><span className="text-sm">{calc.titulo}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="financiamento"><SimuladorFinanciamento /></TabsContent>
              <TabsContent value="quanto-posso"><QuantoPossoFinanciar /></TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
