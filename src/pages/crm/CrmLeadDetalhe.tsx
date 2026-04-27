import { useParams, Link, Navigate } from "react-router-dom";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Phone, Mail, MessageCircle, Calendar, FileText, Upload, Plus, Building2, MapPin, DollarSign } from "lucide-react";
import { MOCK_LEADS, STATUS_LABELS, STATUS_COLORS } from "@/lib/crmMockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ICONS: Record<string, any> = { ligacao: Phone, whatsapp: MessageCircle, email: Mail, visita: Calendar, proposta: FileText, nota: FileText };

export default function CrmLeadDetalhe() {
  const { id } = useParams();
  const lead = MOCK_LEADS.find(l => l.id === id);
  if (!lead) return <Navigate to="/crm/leads" replace />;

  return (
    <CrmLayout>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-3"><Link to="/crm/leads"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link></Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl font-bold">{lead.nome}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className={STATUS_COLORS[lead.status]}>{STATUS_LABELS[lead.status]}</Badge>
              {lead.tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
              <Badge>Score {lead.score}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><MessageCircle className="mr-2 h-4 w-4" />WhatsApp</Button>
            <Button variant="outline"><Mail className="mr-2 h-4 w-4" />Email</Button>
            <Button variant="outline"><Phone className="mr-2 h-4 w-4" />Ligar</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Tabs defaultValue="timeline">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="imoveis">Imóveis enviados</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="notas">Nova interação</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-4">
              <Card>
                <CardHeader><CardTitle>Histórico completo de interações</CardTitle></CardHeader>
                <CardContent>
                  <ol className="relative border-l border-border ml-3 space-y-6">
                    {lead.interactions.map(i => {
                      const Icon = ICONS[i.type] || FileText;
                      return (
                        <li key={i.id} className="ml-6">
                          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Icon className="h-3 w-3" />
                          </span>
                          <p className="text-sm font-medium capitalize">{i.type} <span className="text-muted-foreground font-normal">• {format(new Date(i.date), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}</span></p>
                          <p className="text-sm text-muted-foreground">{i.summary}</p>
                          <p className="text-xs text-muted-foreground mt-1">por {i.user}</p>
                        </li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="imoveis" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Imóveis enviados ao cliente</CardTitle>
                  <Button size="sm"><Plus className="mr-2 h-4 w-4" />Enviar imóvel</Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lead.imoveisEnviados.length === 0 && <p className="text-sm text-muted-foreground">Nenhum imóvel enviado ainda.</p>}
                  {lead.imoveisEnviados.map(im => (
                    <div key={im.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{im.titulo}</p>
                          <p className="text-xs text-muted-foreground">Enviado em {format(new Date(im.enviadoEm), "dd/MM/yyyy")}</p>
                        </div>
                      </div>
                      <p className="font-semibold">R$ {im.preco.toLocaleString("pt-BR")}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentos" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Documentos & anexos</CardTitle>
                  <Button size="sm"><Upload className="mr-2 h-4 w-4" />Enviar arquivo</Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lead.documentos.length === 0 && <p className="text-sm text-muted-foreground">Nenhum documento anexado.</p>}
                  {lead.documentos.map(d => (
                    <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{d.nome}</p>
                          <p className="text-xs text-muted-foreground capitalize">{d.tipo}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">Baixar</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notas" className="mt-4">
              <Card>
                <CardHeader><CardTitle>Registrar nova interação</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Tipo</Label><Input placeholder="Ligação, visita, nota..." /></div>
                    <div><Label>Data</Label><Input type="datetime-local" /></div>
                  </div>
                  <div><Label>Resumo</Label><Textarea rows={4} placeholder="O que aconteceu nesta interação?" /></div>
                  <Button>Registrar</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Contato</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{lead.telefone}</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{lead.email}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{lead.localizacao}</p>
              <p className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" />Renda: {lead.rendaFaixa}</p>
              <p className="text-muted-foreground pt-2">Responsável: <span className="text-foreground font-medium">{lead.responsavel}</span></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Preferências</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Bairro:</span> {lead.preferencias.bairro}</p>
              <p><span className="text-muted-foreground">Tipo:</span> {lead.tipoImovel}</p>
              <p><span className="text-muted-foreground">Quartos:</span> {lead.preferencias.quartos}+</p>
              <p><span className="text-muted-foreground">Valor:</span> R$ {lead.preferencias.valorMin.toLocaleString("pt-BR")} - R$ {lead.preferencias.valorMax.toLocaleString("pt-BR")}</p>
              <p><span className="text-muted-foreground">Metragem:</span> {lead.preferencias.metragemMin} - {lead.preferencias.metragemMax} m²</p>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardHeader><CardTitle className="text-base">Próximo passo sugerido</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm">Com base no histórico, sugerimos: <strong>Enviar 2 novos imóveis compatíveis e agendar visita para a próxima semana.</strong></p>
              <Button size="sm" className="mt-3 w-full">Aplicar sugestão</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </CrmLayout>
  );
}
