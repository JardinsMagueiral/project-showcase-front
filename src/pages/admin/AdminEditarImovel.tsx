import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImovelForm } from "@/components/imoveis/ImovelForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminEditarImovel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: imovel, isLoading } = useQuery({
    queryKey: ["admin-imovel-editar", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("imoveis").select("*, imovel_fotos(id, url, ordem)").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="flex min-h-screen flex-col bg-background"><Header /><main className="flex-1 py-8"><div className="container max-w-4xl px-4"><Skeleton className="h-96" /></div></main><Footer /></div>;
  }

  if (!imovel) {
    return <div className="flex min-h-screen flex-col bg-background"><Header /><main className="flex flex-1 items-center justify-center"><p className="text-muted-foreground">Imóvel não encontrado</p></main><Footer /></div>;
  }

  const imovelData = {
    id: imovel.id,
    tipo: imovel.tipo as "casa" | "apartamento" | "terreno" | "comercial",
    operacao: imovel.operacao as "venda" | "aluguel",
    endereco: imovel.endereco,
    numero: imovel.numero || "",
    complemento: imovel.complemento || "",
    bairro: imovel.bairro || "Jardins Mangueiral",
    cep: imovel.cep || "",
    quartos: imovel.quartos || 0,
    banheiros: imovel.banheiros || 0,
    vagas: imovel.vagas || 0,
    area_m2: imovel.area_m2 ? Number(imovel.area_m2) : undefined,
    preco: Number(imovel.preco),
    condominio: imovel.condominio ? Number(imovel.condominio) : undefined,
    iptu: imovel.iptu ? Number(imovel.iptu) : undefined,
    descricao: imovel.descricao || "",
    mobiliado: !!imovel.mobiliado,
    aceita_pets: !!imovel.aceita_pets,
  };

  const existingPhotos = (imovel.imovel_fotos || [])
    .sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0))
    .map((f: any) => ({ id: f.id, url: f.url }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl px-4">
          <div className="mb-6"><Button variant="ghost" asChild><Link to="/admin/imoveis"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link></Button></div>
          <h1 className="mb-8 font-serif text-3xl font-bold">Editar Imóvel</h1>
          <ImovelForm isAdmin initialData={imovelData} existingPhotos={existingPhotos} onSuccess={() => navigate("/admin/imoveis")} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
