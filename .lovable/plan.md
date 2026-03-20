

## Plano: Copiar todos os paineis Admin do Jardins Mangueiral Connect

### Resumo

Criar 11 paginas de administracao identicas ao projeto original, usando dados mock em vez de Supabase. Inclui tambem o componente `ImovelForm` usado nas paginas de cadastro/edicao de imoveis.

### Paginas a criar

| Arquivo | Descricao |
|---------|-----------|
| `src/pages/admin/AdminDashboard.tsx` | Painel principal com stats e links rapidos (9 cards) |
| `src/pages/admin/AdminImoveis.tsx` | Lista de imoveis com filtro por status, aprovar/rejeitar/destacar/excluir |
| `src/pages/admin/AdminNovoImovel.tsx` | Formulario de cadastro de imovel (usa ImovelForm) |
| `src/pages/admin/AdminEditarImovel.tsx` | Formulario de edicao de imovel (usa ImovelForm) |
| `src/pages/admin/AdminEventos.tsx` | Gerenciar eventos com tabs (pendente/aprovado/rejeitado/todos) |
| `src/pages/admin/AdminParceiros.tsx` | Gerenciar parceiros com tabs e carousel de fotos |
| `src/pages/admin/AdminClassificados.tsx` | Tabela de classificados com acoes |
| `src/pages/admin/AdminClientes.tsx` | Tabela de clientes cadastrados |
| `src/pages/admin/AdminNoticias.tsx` | Gerenciar noticias com aprovar/rejeitar |
| `src/pages/admin/AdminGrupos.tsx` | CRUD de grupos WhatsApp com dialog |
| `src/pages/admin/AdminQuadras.tsx` | Gerenciar quadras com fotos e edicao |

### Componente compartilhado

| Arquivo | Descricao |
|---------|-----------|
| `src/components/imoveis/ImovelForm.tsx` | Formulario completo de imovel com upload de fotos, validacao zod, drag-and-drop |

### Alteracoes em arquivos existentes

- **`src/App.tsx`** -- Adicionar 11 rotas `/admin/*`
- **`package.json`** -- Adicionar dependencias: `react-helmet-async`, `zod`, `react-hook-form`, `@hookform/resolvers`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `date-fns`

### Abordagem tecnica

- Todas as chamadas ao Supabase serao substituidas por **dados mock estaticos** e funcoes locais com `useState`
- Acoes como aprovar/rejeitar/excluir atualizarao apenas o state local
- O `useAuth` sera substituido por dados mock inline (nome do admin, etc.)
- A estrutura visual (layout, classes CSS, icons, textos) sera **identica** ao original
- Nenhuma conexao com backend -- apenas frontend

