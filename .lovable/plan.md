# CRM Funcional — Plano de Implementação

Vou remover todo mock e ligar o CRM ao Supabase, integrando com cadastros de usuários e anúncios. Automações sem Meta API / n8n: tudo via **wa.me** (link clicável que abre o WhatsApp com texto+anexos pré-preenchidos) e **Edge Functions** para agendamentos e tarefas em segundo plano.

## 1. Banco de dados (migration)

Novas tabelas (todas com RLS — admin e gestor têm acesso total, demais usuários nenhum):

- **crm_leads** — `id`, `user_id` (nullable, link com profiles quando vier de cadastro), `nome`, `telefone`, `email`, `valor_aproximado_imovel` (substitui renda), `interesse` (comprar/alugar/investir), `localizacao`, `tipo_imovel`, `status` (novo/atendimento/proposta/fechado/perdido), `tags` (text[]), `score` (int 0-100 calculado), `responsavel_id`, `origem` (cadastro_site/manual/classificado/contato), `bairro_pref`, `valor_min`, `valor_max`, `quartos_pref`, `metragem_min`, `metragem_max`, `observacoes`, `ultimo_contato`, `proximo_followup`
- **crm_interactions** — `lead_id`, `tipo` (ligacao/whatsapp/email/visita/proposta/nota), `resumo`, `criado_por`, `data`
- **crm_imoveis_enviados** — `lead_id`, `imovel_id` (FK imoveis), `enviado_em`, `enviado_por` (evita repetição no matching)
- **crm_templates** — `nome`, `canal` (whatsapp/email), `mensagem` (com placeholders `{{nome}}`, `{{imovel}}`...), `anexos` (jsonb: lista de URLs/links), `incluir_fotos_imovel` (bool), `ativo`
- **crm_template_anexos** (alternativo se quiser uploads dedicados) — ou usar bucket `crm-anexos`
- **crm_agenda** — `lead_id`, `titulo`, `tipo`, `data`, `hora`, `concluido`, `responsavel_id`
- **crm_automations** — `nome`, `trigger` (lead_novo/inativo_7d/imovel_novo/pos_visita), `template_id`, `ativa`, `delay_dias`, `execucoes`
- **crm_automation_logs** — execuções de automação para auditoria

**Trigger `on_auth_user_created` (estender o existente):** ao criar um usuário, inserir também em `crm_leads` com `origem='cadastro_site'`, `status='novo'`, copiando nome/telefone/email do `raw_user_meta_data`.

**Outras origens automáticas:**
- Criar um lead quando alguém posta um classificado (origem `classificado`).
- Trigger para atualizar `ultimo_contato` automaticamente quando entra uma `crm_interaction`.

**Storage:** novo bucket público `crm-anexos` para arquivos de templates (PDFs, imagens).

## 2. Edge Functions

- **crm-send-whatsapp** (POST `{lead_id, template_id, imovel_id?}`): monta a mensagem aplicando placeholders, busca fotos do imóvel (se `incluir_fotos_imovel`), monta URL `https://wa.me/<telefone>?text=<mensagem+links>`, registra `crm_interaction` (whatsapp) e `crm_imoveis_enviados` se houver imóvel, retorna a URL final para o frontend abrir em nova aba. **Não chama API da Meta** — apenas gera o link.
- **crm-run-automations** (cron): roda a cada hora, varre `crm_automations` ativas e cria notificações/tarefas na agenda (ex.: "Lead X parado há 7 dias — enviar follow-up"). Não dispara mensagens automaticamente porque o envio depende do clique do corretor em wa.me; em vez disso cria tarefas pendentes que o corretor clica para abrir o WhatsApp.
- **crm-compute-score** (chamado on-insert/update de lead): calcula score com base em valor, interações, tipo de interesse.

## 3. Frontend — rewrite das páginas

Todas as páginas em `src/pages/crm/*` deixam de importar `crmMockData` e passam a usar `@tanstack/react-query` + supabase.

- **CrmDashboard** — KPIs reais (count por status, leads novos hoje, follow-ups pendentes, matches), tudo via `supabase.from('crm_leads')` e agregações.
- **CrmLeads** — lista paginada da tabela `crm_leads` com filtros server-side (status, tag, busca). Form "Novo Lead" troca campo **Renda mensal → Valor aproximado do imóvel** (numeric, máscara R$).
- **CrmLeadDetalhe** — busca lead + interactions + imoveis_enviados + agenda. Botões "WhatsApp/Email/Ligação" registram interaction; botão "Enviar imóvel" abre dialog para escolher template + imóvel, chama edge function e abre `window.open(wa_url)`.
- **CrmFunil** — Kanban com drag-and-drop entre status (atualiza `crm_leads.status`).
- **CrmAgenda** — calendário com `crm_agenda` real, criar/editar/concluir tarefa.
- **CrmAutomacoes** — CRUD de `crm_automations`, toggle ativa, ver log de execuções.
- **CrmTemplates** — CRUD completo: nome, canal, mensagem (textarea com lista de placeholders disponíveis), checkbox "incluir fotos do imóvel", upload de anexos para o bucket, link externo opcional. Preview com placeholders aplicados.
- **CrmMatching (Ofertas Inteligentes)** — query real cruzando `crm_leads` x `imoveis` (status=`aprovado`):
  - Match por: tipo, faixa de preço (`valor_min`..`valor_max` ou ±20% do `valor_aproximado_imovel`), quartos, metragem.
  - Exclui imóveis já em `crm_imoveis_enviados` para o mesmo lead.
  - Score de match calculado e ordenado.
  - Botão "Enviar" abre dialog com template e dispara edge function.
- **CrmMetricas** — métricas reais (conversão, tempo médio fechamento, ranking).

## 4. Acesso

Continua com role `admin` + role `gestor` (já existe). Layout do CRM verifica `has_role('admin') OR has_role('gestor')`. Admin panel continua só para admin.

## 5. Detalhes técnicos

- Substituir `src/lib/crmMockData.ts` por `src/lib/crmTypes.ts` (apenas tipos + labels/cores de status).
- Criar `src/hooks/useCrm.ts` com hooks reutilizáveis (`useLeads`, `useLead(id)`, `useTemplates`, `useAutomations`, `useMatches`).
- Placeholder system: função `applyPlaceholders(template, {lead, imovel, corretor})` no client; mesma função no edge function.
- wa.me link: `https://wa.me/55<telefone_limpo>?text=<encodeURIComponent(mensagem)>` — fotos viram links no fim da mensagem (`Veja as fotos: <url1> <url2>`).
- O frontend nunca envia automaticamente — apenas abre a URL do WhatsApp Web/app.

```text
[cadastro site] ──trigger──▶ crm_leads(novo)
[classificado]  ──trigger──▶ crm_leads(novo)
                              │
                              ▼
                       Kanban / Lista
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
       Enviar WA        Matching auto      Agenda/Follow-up
       (wa.me link)     (cruza imóveis)    (cron edge fn)
            │
            ▼
       Registra interaction + imovel_enviado
```

## Ordem de execução

1. Migration (tabelas + trigger + bucket + RLS).
2. Edge functions (`crm-send-whatsapp`, `crm-run-automations`, `crm-compute-score`).
3. Hooks + tipos + remoção do mock.
4. Reescrever 9 páginas do CRM.
5. Testar fluxos críticos (cadastro→lead, envio WA, matching).

A migration vem na próxima mensagem para sua aprovação antes de qualquer mudança de código.
