

## Plano: Botao de usuario logado + Esqueci minha senha

### 1. Header — Botao "Entrar" vira nome do usuario

**Arquivo:** `src/components/Header.tsx`

- Importar `useAuth` e usar `user`, `signOut`, `loading`
- Importar icones `User`, `LogOut`
- Quando logado: substituir o botao "Entrar" por um `DropdownMenu` com:
  - Nome do usuario (de `user.user_metadata.nome` ou email)
  - Opcao "Painel Admin" (se admin)
  - Opcao "Sair" que chama `signOut()`
- Quando deslogado: manter o botao "Entrar" atual
- Aplicar a mesma logica no menu mobile (Sheet)

### 2. Login — Link "Esqueci minha senha"

**Arquivo:** `src/pages/Login.tsx`

- Adicionar link "Esqueci minha senha" abaixo do campo de senha, antes do botao Entrar
- O link leva para `/esqueci-senha`

### 3. Pagina "Esqueci minha senha"

**Novo arquivo:** `src/pages/EsqueciSenha.tsx`

- Formulario com campo de email
- Ao enviar, chama `supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/redefinir-senha' })`
- Mostra mensagem de sucesso apos envio

### 4. Pagina "Redefinir senha"

**Novo arquivo:** `src/pages/RedefinirSenha.tsx`

- Detecta token de recovery na URL (hash)
- Formulario com nova senha + confirmacao
- Chama `supabase.auth.updateUser({ password })`
- Redireciona para login apos sucesso

### 5. Rotas

**Arquivo:** `src/App.tsx`

- Adicionar rotas `/esqueci-senha` e `/redefinir-senha`

### Detalhes tecnicos

- Nenhuma migracao de banco necessaria
- O reset de senha usa o fluxo nativo do Supabase Auth
- O nome do usuario vem de `user.user_metadata.nome` (salvo no signup)

