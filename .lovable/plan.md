

## Plano: Corrigir Login e Cadastro igual ao projeto original

### Problemas identificados

1. **Botao "Entrar" no Header** aponta para `/contato` em vez de `/login` (linhas 146 e 198 do Header)
2. **Pagina de Login atual** usa tabs (login + cadastro juntos) -- o original tem paginas separadas
3. **Cadastro** falta CPF e confirmacao de senha

### Solucao

Replicar exatamente o projeto original que tem duas paginas separadas:

**1. Atualizar `src/components/Header.tsx`**
- Trocar `to="/contato"` por `to="/login"` nos dois botoes "Entrar" (desktop e mobile)
- Adicionar icone `LogIn` no import

**2. Reescrever `src/pages/Login.tsx`**
- Pagina separada apenas para login (sem tabs)
- Campos: email + senha com toggle de visibilidade
- Validacao com zod + react-hook-form
- Links para "Esqueceu sua senha?" e "Cadastre-se"
- Identico ao `src/pages/auth/Login.tsx` do original

**3. Criar `src/pages/Cadastro.tsx`**
- Pagina separada de cadastro
- Campos: Nome, Email, Telefone, CPF (opcional), Senha, Confirmar Senha
- Toggle de visibilidade nas senhas
- Validacao zod com `.refine()` para confirmar senha
- Identico ao `src/pages/auth/Cadastro.tsx` do original

**4. Atualizar `src/App.tsx`**
- Adicionar rota `/cadastro` com o novo componente

### Detalhes tecnicos

- Ambas as paginas usam `supabase.auth` diretamente (sem depender do `useAuth` hook para signIn/signUp)
- O `signUp` envia `nome`, `telefone` e `cpf` no `options.data` -- o trigger `handle_new_user` ja existente trata esses dados
- O CPF ja existe na tabela `profiles` como coluna opcional

