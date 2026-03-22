

## Diagnostico: Conexao Supabase

### Situacao atual

O Supabase esta conectado corretamente (client configurado em `src/integrations/supabase/client.ts`), porem **nenhuma pagina esta consumindo dados do banco**. Todas as 15 paginas/componentes ainda usam arrays mock vazios em vez de queries ao Supabase.

### Arquivos que precisam ser conectados

| Arquivo | Tabela Supabase | Tipo |
|---------|----------------|------|
| `src/pages/Imoveis.tsx` | `imoveis` + `imovel_fotos` | Publico |
| `src/pages/ImovelDetalhe.tsx` | `imoveis` + `imovel_fotos` | Publico |
| `src/pages/Classificados.tsx` | `classificados` + `classificado_fotos` | Publico |
| `src/pages/ClassificadoDetalhe.tsx` | `classificados` + `classificado_fotos` | Publico |
| `src/pages/Parceiros.tsx` | `parceiros` + `parceiro_fotos` | Publico |
| `src/pages/Noticias.tsx` | `noticias` | Publico |
| `src/pages/Eventos.tsx` / `EventsCalendar.tsx` | `eventos` | Publico |
| `src/pages/Grupos.tsx` / `WhatsAppGroups.tsx` | `whatsapp_grupos` | Publico |
| `src/pages/QuadraDetalhe.tsx` | `quadras` + `quadra_fotos` | Publico |
| `src/components/FeaturedProperties.tsx` | `imoveis` (destaque=true) | Publico |
| `src/pages/admin/AdminDashboard.tsx` | Contagens de todas tabelas | Admin |
| `src/pages/admin/AdminImoveis.tsx` | `imoveis` + `profiles` | Admin |
| `src/pages/admin/AdminEventos.tsx` | `eventos` | Admin |
| `src/pages/admin/AdminParceiros.tsx` | `parceiros` + `parceiro_fotos` | Admin |
| `src/pages/admin/AdminClassificados.tsx` | `classificados` | Admin |
| `src/pages/admin/AdminClientes.tsx` | `profiles` | Admin |
| `src/pages/admin/AdminNoticias.tsx` | `noticias` | Admin |
| `src/pages/admin/AdminGrupos.tsx` | `whatsapp_grupos` | Admin |
| `src/pages/admin/AdminQuadras.tsx` | `quadras` + `quadra_fotos` | Admin |
| `src/components/imoveis/ImovelForm.tsx` | `imoveis` + `imovel_fotos` + storage | Admin |

### O que precisa ser feito

1. **Paginas publicas (10 arquivos)** -- Substituir arrays mock por queries `supabase.from('tabela').select()` usando `useQuery` do React Query. Dados publicos (status = 'aprovado') nao precisam de autenticacao.

2. **Paginas admin (9 arquivos)** -- Substituir arrays mock por queries ao Supabase. As operacoes de CRUD (aprovar, rejeitar, excluir, destacar) precisam de mutacoes reais. Estas paginas so funcionarao com usuario autenticado com role 'admin' devido ao RLS.

3. **Autenticacao** -- Ainda nao existe login/cadastro no projeto. As paginas admin dependem de autenticacao + role 'admin' para funcionar (RLS exige `has_role(auth.uid(), 'admin')`). Sera necessario criar:
   - Pagina de login
   - Hook `useAuth` 
   - Protecao de rotas admin

4. **Upload de arquivos** -- O `ImovelForm` e as paginas de parceiros/quadras precisam de upload para os storage buckets (`imoveis`, `parceiros`, `classificados`, `quadras`, `noticias`) que ja existem.

### Ordem recomendada de implementacao

**Etapa 1 -- Paginas publicas** (nao precisa de auth)
- Conectar as 10 paginas/componentes publicos ao Supabase
- Dados com `status = 'aprovado'` sao acessiveis sem login pelo RLS

**Etapa 2 -- Autenticacao**
- Criar pagina de login/cadastro
- Criar hook `useAuth` com verificacao de role
- Proteger rotas `/admin/*`

**Etapa 3 -- Paginas admin**
- Conectar as 9 paginas admin com queries e mutacoes reais
- Integrar upload de fotos nos storage buckets

### Nota importante

Nao ha necessidade de migracoes SQL -- todas as tabelas, RLS policies, functions (`has_role`, `handle_new_user`), e storage buckets ja estao configurados corretamente no Supabase.

