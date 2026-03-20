import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, ExternalLink, Clock } from "lucide-react";
import { toast } from "sonner";

interface Noticia {
  id: string;
  titulo: string;
  descricao: string | null;
  link: string | null;
  status: string;
  created_at: string;
}

const mockNoticias: Noticia[] = [
  { id: "1", titulo: "Nova escola será construída no Mangueiral", descricao: "Previsão de entrega para 2025", link: "https://example.com/escola", status: "pendente", created_at: "2024-03-10" },
  { id: "2", titulo: "Obras de pavimentação concluídas na Quadra 7", descricao: "As obras foram finalizadas com sucesso", link: null, status: "aprovado", created_at: "2024-03-05" },
  { id: "3", titulo: "Campanha de vacinação no posto de saúde", descricao: null, link: "https://example.com/vacinacao", status: "aprovado", created_at: "2024-02-28" },
  { id: "4", titulo: "Feira de empreendedores locais", descricao: "Evento para divulgação de negócios locais", link: null, status: "rejeitado", created_at: "2024-02-20" },
  { id: "5", titulo: "Novo ponto de ônibus inaugurado", descricao: "Linha 123 agora passa pelo Mangueiral", link: null, status: "pendente", created_at: "2024-03-12" },
];

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>(mockNoticias);
  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = (id: string, status: string) => {
    setUpdating(id);
    setNoticias(prev => prev.map(n => n.id === id ? { ...n, status } : n));
    toast.success(`Notícia ${status === "aprovado" ? "aprovada" : "rejeitada"}!`);
    setUpdating(null);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "aprovado": return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case "rejeitado": return <Badge variant="destructive">Rejeitado</Badge>;
      default: return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Voltar ao Painel</Link>
          </Button>
          <h1 className="font-serif text-3xl font-bold mb-6">Gerenciar Notícias</h1>
          {noticias.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma notícia enviada ainda.</p>
          ) : (
            <div className="space-y-4">
              {noticias.map(n => (
                <Card key={n.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {statusBadge(n.status)}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(n.created_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <h3 className="font-semibold">{n.titulo}</h3>
                        {n.descricao && <p className="text-sm text-muted-foreground mt-1">{n.descricao}</p>}
                        {n.link && (
                          <a href={n.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 mt-1">
                            <ExternalLink className="h-3 w-3" />{n.link}
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {n.status !== "aprovado" && (
                          <Button size="sm" onClick={() => updateStatus(n.id, "aprovado")} disabled={updating === n.id}>
                            <CheckCircle className="mr-1 h-3 w-3" />Aprovar
                          </Button>
                        )}
                        {n.status !== "rejeitado" && (
                          <Button size="sm" variant="destructive" onClick={() => updateStatus(n.id, "rejeitado")} disabled={updating === n.id}>
                            <XCircle className="mr-1 h-3 w-3" />Rejeitar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
