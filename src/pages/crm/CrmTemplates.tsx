import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageCircle, Mail, Edit } from "lucide-react";
import { MOCK_TEMPLATES } from "@/lib/crmMockData";

const ICONS: Record<string, any> = { WhatsApp: MessageCircle, Email: Mail };

export default function CrmTemplates() {
  return (
    <CrmLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Templates & Comunicação</h1>
          <p className="text-muted-foreground">Mensagens prontas integradas com WhatsApp, Email e Ligações</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Novo template</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {MOCK_TEMPLATES.map(t => {
          const Icon = ICONS[t.canal] || Mail;
          return (
            <Card key={t.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{t.nome}</p>
                      <Badge variant="outline" className="text-xs mt-1">{t.canal}</Badge>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                </div>
                <p className="text-sm text-muted-foreground rounded-lg bg-muted p-3 italic">"{t.preview}"</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Integrações de comunicação</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            { canal: "WhatsApp", status: "Conectado", color: "text-emerald-600 bg-emerald-500/10" },
            { canal: "Email (SMTP)", status: "Conectado", color: "text-emerald-600 bg-emerald-500/10" },
            { canal: "Ligações", status: "Manual", color: "text-amber-600 bg-amber-500/10" },
          ].map(i => (
            <div key={i.canal} className="rounded-lg border p-4">
              <p className="font-medium">{i.canal}</p>
              <Badge variant="outline" className={`mt-2 ${i.color} border-0`}>{i.status}</Badge>
              <p className="text-xs text-muted-foreground mt-2">Sincronização automática de conversas e registro de interações.</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </CrmLayout>
  );
}
