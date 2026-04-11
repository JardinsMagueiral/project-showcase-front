import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, XCircle, Trash2, Star, Phone, Mail, Instagram, Globe, MapPin } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminParceiros() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pendente");

  const { data: parceiros = [], isLoading } = useQuery({
    queryKey: ["admin-parceiros"],
    queryFn: async () => {
      const { data, error } = await supabase.from("parceiros").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase.from("parceiros").update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-parceiros"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("parceiros").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-parceiros"] });
      toast({ title: "Parceiro excluído" });
    },
  });

  const updateStatus = (id: string, status: string) => {
    updateMutation.mutate({ id, updates: { status } }, {
      onSuccess: () => toast({ title: status === "aprovado" ? "Parceiro aprovado!" : "Parceiro rejeitado" }),
    });
  };

  const toggleDestaque = (id: string, destaque: boolean) => {
    updateMutation.mutate({ id, updates: { destaque: !destaque } }, {
      onSuccess: () => toast({ title: !destaque ? "Parceiro destacado!" : "Destaque removido" }),
    });
  };

  const filteredParceiros = parceiros.filter(p => p.status === activeTab);
  const counts = {
    pendente: parceiros.filter(p => p.status === "pendente").length,
    aprovado: parceiros.filter(p => p.status === "aprovado").length,
    rejeitado: parceiros.filter(p => p.status === "rejeitado").length,
  };

  const ParceiroCard = ({ parceiro }: { parceiro: typeof parceiros[0] }) => (
    <Card className={parceiro.destaque ? "ring-2 ring-primary" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{parceiro.categoria}</Badge>
            {parceiro.destaque && <Star className="h-4 w-4 fill-primary text-primary" />}
          </div>
          <Badge variant={parceiro.status === "aprovado" ? "default" : parceiro.status === "pendente" ? "secondary" : "destructive"}>{parceiro.status}</Badge>
        </div>
        <CardTitle className="text-lg">{parceiro.nome}</CardTitle>
        {parceiro.descricao && <CardDescription className="line-clamp-2">{parceiro.descricao}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><a href={`tel:${parceiro.telefone}`}>{parceiro.telefone}</a></div>
          {parceiro.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><a href={`mailto:${parceiro.email}`}>{parceiro.email}</a></div>}
          {parceiro.instagram && <div className="flex items-center gap-2"><Instagram className="h-4 w-4" /><span>@{parceiro.instagram.replace("@", "")}</span></div>}
          {parceiro.site && <div className="flex items-center gap-2"><Globe className="h-4 w-4" /><span className="truncate">{parceiro.site}</span></div>}
          {parceiro.endereco && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span className="line-clamp-1">{parceiro.endereco}</span></div>}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {parceiro.status === "pendente" && (
            <>
              <Button size="sm" onClick={() => updateStatus(parceiro.id, "aprovado")}><CheckCircle className="mr-1 h-4 w-4" />Aprovar</Button>
              <Button size="sm" variant="destructive" onClick={() => updateStatus(parceiro.id, "rejeitado")}><XCircle className="mr-1 h-4 w-4" />Rejeitar</Button>
            </>
          )}
          {parceiro.status === "aprovado" && (
            <Button size="sm" variant={parceiro.destaque ? "secondary" : "outline"} onClick={() => toggleDestaque(parceiro.id, !!parceiro.destaque)}>
              <Star className={`mr-1 h-4 w-4 ${parceiro.destaque ? "fill-current" : ""}`} />{parceiro.destaque ? "Remover Destaque" : "Destacar"}
            </Button>
          )}
          {parceiro.status === "rejeitado" && (
            <Button size="sm" variant="outline" onClick={() => updateStatus(parceiro.id, "aprovado")}><CheckCircle className="mr-1 h-4 w-4" />Aprovar</Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Excluir parceiro?</AlertDialogTitle><AlertDialogDescription>O parceiro "{parceiro.nome}" será removido permanentemente.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => deleteMutation.mutate(parceiro.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="flex min-h-screen flex-col bg-background"><Header /><main className="flex-1 py-8"><div className="container px-4"><Skeleton className="h-96" /></div></main><Footer /></div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="mb-6 flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild><Link to="/admin"><ArrowLeft className="h-5 w-5" /></Link></Button>
            <div><h1 className="font-serif text-3xl font-bold">Gerenciar Parceiros</h1><p className="text-muted-foreground">Aprove, rejeite ou destaque parceiros da comunidade</p></div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pendente" className="gap-2">Pendentes{counts.pendente > 0 && <Badge variant="secondary" className="ml-1">{counts.pendente}</Badge>}</TabsTrigger>
              <TabsTrigger value="aprovado" className="gap-2">Aprovados<Badge variant="secondary" className="ml-1">{counts.aprovado}</Badge></TabsTrigger>
              <TabsTrigger value="rejeitado" className="gap-2">Rejeitados<Badge variant="secondary" className="ml-1">{counts.rejeitado}</Badge></TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              {filteredParceiros.length === 0 ? (
                <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum parceiro {activeTab}.</CardContent></Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filteredParceiros.map(p => <ParceiroCard key={p.id} parceiro={p} />)}</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
