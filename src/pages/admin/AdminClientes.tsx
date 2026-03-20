import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  created_at: string;
  imoveis_count: number;
}

const mockClientes: Cliente[] = [
  { id: "1", nome: "Maria Silva", email: "maria@email.com", telefone: "(61) 99999-1111", created_at: "2024-01-15", imoveis_count: 2 },
  { id: "2", nome: "João Santos", email: "joao@email.com", telefone: "(61) 99999-2222", created_at: "2024-01-10", imoveis_count: 1 },
  { id: "3", nome: "Ana Oliveira", email: "ana@email.com", telefone: "(61) 99999-3333", created_at: "2024-02-05", imoveis_count: 0 },
  { id: "4", nome: "Carlos Lima", email: "carlos@email.com", telefone: "(61) 99999-4444", created_at: "2024-02-20", imoveis_count: 3 },
  { id: "5", nome: "Fernanda Costa", email: "fernanda@email.com", telefone: "(61) 99999-5555", created_at: "2024-03-01", imoveis_count: 1 },
];

export default function AdminClientes() {
  const [clientes] = useState<Cliente[]>(mockClientes);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="mb-6">
            <Button variant="ghost" asChild><Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link></Button>
          </div>
          <div className="mb-8">
            <h1 className="flex items-center gap-2 font-serif text-3xl font-bold">
              <Users className="h-8 w-8" />Clientes Cadastrados
            </h1>
            <p className="text-muted-foreground">{clientes.length} cliente{clientes.length !== 1 ? "s" : ""} encontrado{clientes.length !== 1 ? "s" : ""}</p>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-center">Imóveis</TableHead>
                    <TableHead>Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map(cliente => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.nome}</TableCell>
                      <TableCell>{cliente.email}</TableCell>
                      <TableCell>{cliente.telefone}</TableCell>
                      <TableCell className="text-center">{cliente.imoveis_count}</TableCell>
                      <TableCell>{format(new Date(cliente.created_at), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
