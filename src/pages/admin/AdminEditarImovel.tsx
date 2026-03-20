import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImovelForm } from "@/components/imoveis/ImovelForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminEditarImovel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data for editing
  const imovelData = {
    id: id,
    tipo: "casa" as const,
    operacao: "venda" as const,
    endereco: "Quadra 1, Conjunto A, Casa 12",
    numero: "12",
    complemento: "",
    bairro: "Jardins Mangueiral",
    cep: "71936-250",
    quartos: 3,
    banheiros: 2,
    vagas: 1,
    area_m2: 90,
    preco: 450000,
    condominio: 350,
    iptu: 120,
    descricao: "Casa bem localizada com 3 quartos, 2 banheiros e 1 vaga de garagem.",
    mobiliado: false,
    aceita_pets: true,
  };

  const existingPhotos = [
    { id: "photo-1", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400" },
    { id: "photo-2", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400" },
  ];

  const handleSuccess = () => {
    navigate("/admin/imoveis");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl px-4">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link to="/admin/imoveis"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link>
            </Button>
          </div>
          <h1 className="mb-8 font-serif text-3xl font-bold">Editar Imóvel</h1>
          <ImovelForm isAdmin initialData={imovelData} existingPhotos={existingPhotos} onSuccess={handleSuccess} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
