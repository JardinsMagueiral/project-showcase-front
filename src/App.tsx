import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import QuemSomos from "./pages/QuemSomos";
import Imoveis from "./pages/Imoveis";
import ImovelDetalhe from "./pages/ImovelDetalhe";
import Noticias from "./pages/Noticias";
import Parceiros from "./pages/Parceiros";
import Grupos from "./pages/Grupos";
import Eventos from "./pages/Eventos";
import Calculadoras from "./pages/Calculadoras";
import Contato from "./pages/Contato";
import Classificados from "./pages/Classificados";
import ClassificadoDetalhe from "./pages/ClassificadoDetalhe";
import QuadraDetalhe from "./pages/QuadraDetalhe";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminImoveis from "./pages/admin/AdminImoveis";
import AdminNovoImovel from "./pages/admin/AdminNovoImovel";
import AdminEditarImovel from "./pages/admin/AdminEditarImovel";
import AdminEventos from "./pages/admin/AdminEventos";
import AdminParceiros from "./pages/admin/AdminParceiros";
import AdminClassificados from "./pages/admin/AdminClassificados";
import AdminClientes from "./pages/admin/AdminClientes";
import AdminNoticias from "./pages/admin/AdminNoticias";
import AdminGrupos from "./pages/admin/AdminGrupos";
import AdminQuadras from "./pages/admin/AdminQuadras";
import CrmDashboard from "./pages/crm/CrmDashboard";
import CrmLeads from "./pages/crm/CrmLeads";
import CrmLeadDetalhe from "./pages/crm/CrmLeadDetalhe";
import CrmFunil from "./pages/crm/CrmFunil";
import CrmAgenda from "./pages/crm/CrmAgenda";
import CrmAutomacoes from "./pages/crm/CrmAutomacoes";
import CrmTemplates from "./pages/crm/CrmTemplates";
import CrmMatching from "./pages/crm/CrmMatching";
import CrmMetricas from "./pages/crm/CrmMetricas";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quadra/:numero" element={<QuadraDetalhe />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/imoveis" element={<Imoveis />} />
            <Route path="/imoveis/:id" element={<ImovelDetalhe />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/parceiros" element={<Parceiros />} />
            <Route path="/grupos" element={<Grupos />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/calculadoras" element={<Calculadoras />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/classificados" element={<Classificados />} />
            <Route path="/classificados/:id" element={<ClassificadoDetalhe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/imoveis" element={<ProtectedRoute requireAdmin><AdminImoveis /></ProtectedRoute>} />
            <Route path="/admin/novo-imovel" element={<ProtectedRoute requireAdmin><AdminNovoImovel /></ProtectedRoute>} />
            <Route path="/admin/imoveis/:id/editar" element={<ProtectedRoute requireAdmin><AdminEditarImovel /></ProtectedRoute>} />
            <Route path="/admin/eventos" element={<ProtectedRoute requireAdmin><AdminEventos /></ProtectedRoute>} />
            <Route path="/admin/parceiros" element={<ProtectedRoute requireAdmin><AdminParceiros /></ProtectedRoute>} />
            <Route path="/admin/classificados" element={<ProtectedRoute requireAdmin><AdminClassificados /></ProtectedRoute>} />
            <Route path="/admin/clientes" element={<ProtectedRoute requireAdmin><AdminClientes /></ProtectedRoute>} />
            <Route path="/admin/noticias" element={<ProtectedRoute requireAdmin><AdminNoticias /></ProtectedRoute>} />
            <Route path="/admin/grupos" element={<ProtectedRoute requireAdmin><AdminGrupos /></ProtectedRoute>} />
            <Route path="/admin/quadras" element={<ProtectedRoute requireAdmin><AdminQuadras /></ProtectedRoute>} />
            <Route path="/crm" element={<ProtectedRoute requireCrm><CrmDashboard /></ProtectedRoute>} />
            <Route path="/crm/leads" element={<ProtectedRoute requireCrm><CrmLeads /></ProtectedRoute>} />
            <Route path="/crm/leads/:id" element={<ProtectedRoute requireCrm><CrmLeadDetalhe /></ProtectedRoute>} />
            <Route path="/crm/funil" element={<ProtectedRoute requireCrm><CrmFunil /></ProtectedRoute>} />
            <Route path="/crm/agenda" element={<ProtectedRoute requireCrm><CrmAgenda /></ProtectedRoute>} />
            <Route path="/crm/automacoes" element={<ProtectedRoute requireCrm><CrmAutomacoes /></ProtectedRoute>} />
            <Route path="/crm/templates" element={<ProtectedRoute requireCrm><CrmTemplates /></ProtectedRoute>} />
            <Route path="/crm/matching" element={<ProtectedRoute requireCrm><CrmMatching /></ProtectedRoute>} />
            <Route path="/crm/metricas" element={<ProtectedRoute requireCrm><CrmMetricas /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
