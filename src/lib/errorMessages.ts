// Maps raw Supabase / auth errors to safe user-facing Portuguese messages.
// Always logs the raw error to the console for debugging.

const AUTH_MAP: Record<string, string> = {
  "invalid_credentials": "Email ou senha inválidos.",
  "Invalid login credentials": "Email ou senha inválidos.",
  "user_already_exists": "Já existe uma conta com este email.",
  "User already registered": "Já existe uma conta com este email.",
  "email_not_confirmed": "Confirme seu email antes de entrar.",
  "Email not confirmed": "Confirme seu email antes de entrar.",
  "weak_password": "Senha muito fraca. Use ao menos 6 caracteres.",
  "Password should be at least 6 characters": "A senha deve ter no mínimo 6 caracteres.",
  "over_email_send_rate_limit": "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  "Email rate limit exceeded": "Muitas tentativas de email. Tente novamente mais tarde.",
  "Auth session missing!": "Sessão expirada. Faça login novamente.",
  "You can only update your password from the recovery flow": "Você só pode redefinir a senha através do link de recuperação.",
};

export function safeAuthError(error: unknown, fallback = "Ocorreu um erro. Tente novamente."): string {
  console.error("[auth error]", error);
  const msg = (error as { message?: string })?.message ?? "";
  const code = (error as { code?: string })?.code ?? "";
  return AUTH_MAP[code] || AUTH_MAP[msg] || fallback;
}

export function safeDbError(error: unknown, fallback = "Não foi possível concluir a operação. Tente novamente."): string {
  console.error("[db error]", error);
  const msg = (error as { message?: string })?.message ?? "";
  if (msg.includes("row-level security") || msg.includes("permission denied")) {
    return "Você não tem permissão para realizar esta ação.";
  }
  if (msg.includes("duplicate key")) {
    return "Este registro já existe.";
  }
  if (msg.includes("violates foreign key")) {
    return "Referência inválida. Verifique os dados e tente novamente.";
  }
  return fallback;
}
