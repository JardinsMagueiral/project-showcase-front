import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireCrm?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false, requireCrm = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin, hasCrmAccess } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  if (requireCrm && !hasCrmAccess) return <Navigate to="/" replace />;

  return <>{children}</>;
}
