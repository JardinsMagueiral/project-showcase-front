import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
