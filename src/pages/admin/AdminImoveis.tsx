import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, X, Trash2, Eye, Star, StarOff, Pencil } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Imovel {
  id: string;
  tipo: string;
  operacao: string;
  endereco: string;
  bairro: string;
  preco: number;
  quartos: number;
  status: string;
  destaque: boolean;
  created_at: string;
  profiles: { nome: string; email: string; telefone: string } | null;
}

const mockImoveis: Imovel[] = [
  { id: "1", tipo: "casa", operacao: "venda", endereco: "Quadra 1, Conjunto A, Casa 12", bairro: "Jardins Mangueiral", preco: 450000, quartos: 3, status: "pendente", destaque: false, created_at: "2024-01-15", profiles: { nome: "Maria Silva", email: "maria@email.com", telefone: "(61) 99999-1111" } },
  { id: "2", tipo: "apartamento", operacao: "aluguel", endereco: "Quadra 3, Bloco B, Apto 204", bairro: "Jardins Mangueiral", preco: 1800, quartos: 2, status: "aprovado", destaque: true, created_at: "2024-01-10", profiles: { nome: "João Santos", email: "joao@email.com", telefone: "(61) 99999-2222" } },
  { id: "3", tipo: "casa", operacao: "venda", endereco: "Quadra 5, Conjunto C, Casa 8", bairro: "Jardins Mangueiral", preco: 520000, quartos: 4, status: "aprovado", destaque: false, created_at: "2024-01-08", profiles: { nome: "Ana Oliveira", email: "ana@email.com", telefone: "(61) 99999-3333" } },
  { id: "4", tipo: "terreno", operacao: "venda", endereco: "Quadra 8, Lote 15", bairro: "Jardins Mangueiral", preco: 180000, quartos: 0, status: "rejeitado", destaque: false, created_at: "2024-01-05", profiles: { nome: "Carlos Lima", email: "carlos@email.com", telefone: "(61) 99999-4444" } },
];

export default function AdminImoveis() {
  const [imoveis, setImoveis] = useState<Imovel[]>(mockImoveis);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const updateStatus = (id: string, status: string) => {
    setImoveis(imoveis.map((i) => (i.id === id ? { ...i, status } : i)));
    toast({ title: "Status atualizado", description: `Imóvel ${status === "aprovado" ? "aprovado" : "rejeitado"} com sucesso` });
  };

  const toggleDestaque = (id: string, destaque: boolean) => {
    setImoveis(imoveis.map((i) => (i.id === id ? { ...i, destaque: !destaque } : i)));
    toast({ title: destaque ? "Destaque removido" : "Imóvel destacado" });
  };

  const handleDelete = (id: string) => {
    setImoveis(imoveis.filter((i) => i.id !== id));
    toast({ title: "Imóvel excluído", description: "O imóvel foi removido com sucesso" });
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: "secondary" | "default" | "destructive" | "outline" }> = {
      pendente: { label: "Pendente", variant: "secondary" },
      aprovado: { label: "Aprovado", variant: "default" },
      rejeitado: { label: "Rejeitado", variant: "destructive" },
      inativo: { label: "Inativo", variant: "outline" },
    };
    const c = config[status] || config.pendente;
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const filteredImoveis = filter === "all" ? imoveis : imoveis.filter((i) => i.status === filter);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="mb-6">
            <Button variant="ghost" asChild><Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link></Button>
          </div>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold">Gerenciar Imóveis</h1>
              <p className="text-muted-foreground">{filteredImoveis.length} imóveis encontrados</p>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Filtrar por status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="aprovado">Aprovados</SelectItem>
                <SelectItem value="rejeitado">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredImoveis.length === 0 ? (
            <Card><CardContent className="py-8 text-center"><p className="text-muted-foreground">Nenhum imóvel encontrado</p></CardContent></Card>
          ) : (
            <div className="space-y-4">
              {filteredImoveis.map((imovel) => (
                <Card key={imovel.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold capitalize">{imovel.tipo} para {imovel.operacao}</h3>
                          {getStatusBadge(imovel.status)}
                          {imovel.destaque && (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                              <Star className="mr-1 h-3 w-3 fill-current" />Destaque
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{imovel.endereco}, {imovel.bairro}</p>
                        <p className="text-lg font-bold text-primary">{formatPrice(imovel.preco)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {imovel.status === "pendente" && (
                          <>
                            <Button size="sm" onClick={() => updateStatus(imovel.id, "aprovado")}><Check className="mr-1 h-4 w-4" />Aprovar</Button>
                            <Button variant="destructive" size="sm" onClick={() => updateStatus(imovel.id, "rejeitado")}><X className="mr-1 h-4 w-4" />Rejeitar</Button>
                          </>
                        )}
                        <Button variant="outline" size="sm" onClick={() => toggleDestaque(imovel.id, imovel.destaque)}>
                          {imovel.destaque ? <><StarOff className="mr-1 h-4 w-4" />Remover Destaque</> : <><Star className="mr-1 h-4 w-4" />Destacar</>}
                        </Button>
                        <Button variant="outline" size="sm" asChild><Link to={`/admin/imoveis/${imovel.id}/editar`}><Pencil className="mr-1 h-4 w-4" />Editar</Link></Button>
                        <Button variant="outline" size="sm" asChild><Link to={`/imoveis/${imovel.id}`}><Eye className="mr-1 h-4 w-4" />Ver</Link></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="mr-1 h-4 w-4" />Excluir</Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir imóvel?</AlertDialogTitle>
                              <AlertDialogDescription>Esta ação não pode ser desfeita. O imóvel será permanentemente removido.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(imovel.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
