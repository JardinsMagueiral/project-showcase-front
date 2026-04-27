import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Kanban, Calendar, Zap, Sparkles, BarChart3, MessageSquare, FileText, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/crm", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/crm/leads", label: "Leads & Clientes", icon: Users },
  { href: "/crm/funil", label: "Funil de Vendas", icon: Kanban },
  { href: "/crm/agenda", label: "Agenda & Follow-ups", icon: Calendar },
  { href: "/crm/automacoes", label: "Automações", icon: Zap },
  { href: "/crm/templates", label: "Templates & Comunicação", icon: MessageSquare },
  { href: "/crm/matching", label: "Ofertas Inteligentes", icon: Sparkles },
  { href: "/crm/metricas", label: "Métricas & Relatórios", icon: BarChart3 },
];

export function CrmLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  const fullName = user?.user_metadata?.nome || user?.email || "Usuário";
  const userName = fullName.split(" ")[0].split("@")[0];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="font-serif text-base font-semibold leading-none">CRM</p>
            <p className="text-xs text-muted-foreground mt-0.5">Jardins Mangueiral</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = item.exact ? location.pathname === item.href : location.pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t p-3">
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground">Logado como</p>
            <p className="truncate text-sm font-medium">{userName}</p>
          </div>
          {isAdmin && (
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link to="/admin"><Home className="mr-2 h-4 w-4" />Painel Admin</Link>
            </Button>
          )}
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to="/"><Home className="mr-2 h-4 w-4" />Ir ao site</Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />Sair
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <div className="md:hidden flex h-14 items-center justify-between border-b bg-card px-4">
          <p className="font-serif font-semibold">CRM</p>
          <Button variant="ghost" size="sm" asChild><Link to="/">Sair</Link></Button>
        </div>
        <div className="md:hidden border-b bg-card overflow-x-auto">
          <div className="flex gap-1 p-2">
            {navItems.map((item) => {
              const active = item.exact ? location.pathname === item.href : location.pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
                    active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />{item.label.split(" ")[0]}
                </Link>
              );
            })}
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
