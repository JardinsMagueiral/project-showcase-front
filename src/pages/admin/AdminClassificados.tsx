import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, XCircle, Trash2, Eye } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Classificado {
  id: string;
  titulo: string;
  preco: number;
  categoria: string;
  status: string;
  profiles?: { nome: string } | null;
}

const mockClassificados: Classificado[] = [];
  { id: "2", titulo: "Bicicleta aro 29", preco: 1200, categoria: "Esportes", status: "aprovado", profiles: { nome: "João Santos" } },
  { id: "3", titulo: "iPhone 13 128GB", preco: 3500, categoria: "Eletrônicos", status: "aprovado", profiles: { nome: "Ana Oliveira" } },
  { id: "4", titulo: "Mesa de escritório", preco: 350, categoria: "Móveis", status: "rejeitado", profiles: { nome: "Carlos Lima" } },
  { id: "5", titulo: "Roupas infantis (lote)", preco: 150, categoria: "Roupas", status: "pendente", profiles: { nome: "Fernanda Costa" } },
];

export default function AdminClassificados() {
  const [classificados, setClassificados] = useState<Classificado[]>(mockClassificados);
  const { toast } = useToast();

  const updateStatus = (id: string, status: string) => {
    setClassificados(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    toast({ title: `Anúncio ${status === "aprovado" ? "aprovado" : "rejeitado"}!` });
  };

  const handleDelete = (id: string) => {
    setClassificados(prev => prev.filter(c => c.id !== id));
    toast({ title: "Anúncio excluído!" });
  };

  const formatPrice = (price: number) => price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const getStatusBadge = (status: string) => {
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
          <div className="mb-6">
            <Button variant="ghost" asChild><Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link></Button>
          </div>
          <div className="mb-6">
            <h1 className="font-serif text-3xl font-bold">Gerenciar Classificados</h1>
            <p className="text-muted-foreground">{classificados.filter(c => c.status === "pendente").length} anúncio(s) pendente(s)</p>
          </div>
          {classificados.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum anúncio cadastrado.</p>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Anunciante</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classificados.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.titulo}</TableCell>
                          <TableCell>{item.categoria}</TableCell>
                          <TableCell>{formatPrice(item.preco)}</TableCell>
                          <TableCell className="text-sm">{item.profiles?.nome || "—"}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" asChild><Link to={`/classificados/${item.id}`}><Eye className="h-4 w-4" /></Link></Button>
                              {item.status !== "aprovado" && (
                                <Button variant="ghost" size="icon" onClick={() => updateStatus(item.id, "aprovado")} title="Aprovar">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                              {item.status !== "rejeitado" && (
                                <Button variant="ghost" size="icon" onClick={() => updateStatus(item.id, "rejeitado")} title="Rejeitar">
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Excluir"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>Excluir anúncio?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                                  <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(item.id)}>Excluir</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
