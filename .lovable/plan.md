

## Plano: 5 correções

### 1. Filtros nos imóveis ao clicar "Ver Todos"

O botão "Ver Todos" (desktop e mobile) leva para `/imoveis` sem filtros. A página `/imoveis` (`src/pages/Imoveis.tsx`) não lê query params para filtrar. O `PropertySearch` já envia filtros via query params mas a página ignora.

**Arquivo: `src/pages/Imoveis.tsx`**
- Ler query params (`useSearchParams`) para `tipo`, `operacao`, `quartos`, `banheiros`, `precoMin`, `precoMax`, `search`
- Filtrar client-side o array de imóveis com base nesses params

### 2. Botão "Login para anunciar" nos Desapegos

**Arquivo: `src/pages/Classificados.tsx`**
- Importar `useAuth` e `Button`
- Adicionar seção CTA: se não logado, botão "Faça login para anunciar"; se logado, botão para criar anúncio (ou link para contato)

### 3. Grupos WhatsApp no rodapé via Supabase

O projeto original busca os grupos da tabela `whatsapp_grupos` no footer. O atual usa lista hardcoded.

**Arquivo: `src/components/Footer.tsx`**
- Importar `useState`, `useEffect`, `supabase`
- Buscar grupos de `whatsapp_grupos` (ativo=true, order by ordem) no `useEffect`
- Substituir o array hardcoded `footerGroups` pelos dados do banco

### 4. Botão "Entrar" ainda aparece quando logado (mobile)

O Header desktop já funciona (`hidden sm:flex`), mas no mobile o botão do dropdown do usuário tem `className="hidden sm:flex"` — então em telas < 640px o botão do usuário some e nada aparece.

**Arquivo: `src/components/Header.tsx`**
- O `DropdownMenuTrigger` do usuário logado (linha 158) tem `className="hidden sm:flex"` — o botão some no mobile
- Precisa adicionar uma versão do botão de usuário visível no mobile (antes do menu hamburger), ou garantir que o dropdown funcione em todas as telas (remover `hidden sm:flex` ou usar `flex` sem restrição)

### 5. Nome na aba do navegador mostra "lovableapp"

O `<title>` no `index.html` já diz "Jardins Mangueiral", mas na URL publicada (`jardinsmanguerak.lovable.app`) o Lovable pode injetar seu próprio título. Vamos garantir que o título esteja correto no HTML e também adicionar um `document.title` no `main.tsx` como fallback.

**Arquivo: `index.html`**
- Verificar/manter `<title>Jardins Mangueiral</title>` (já está correto)
- Remover os comentários TODO que mencionam "Lovable"

**Arquivo: `src/main.tsx`**
- Adicionar `document.title = "Jardins Mangueiral"` como segurança

### Detalhes técnicos

- Nenhuma migração de banco necessária
- 5 arquivos alterados: `Footer.tsx`, `Header.tsx`, `Imoveis.tsx`, `Classificados.tsx`, `index.html`/`main.tsx`

