import PerfilPage from "./pages/PerfilPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ClientesPage from "./pages/ClientesPage";
import NovoClientePage from "./pages/NovoClientePage";
import AnalistasPage from "./pages/AnalistasPage";
import NovoAnalistaPage from "./pages/NovoAnalistaPage";
import NovaOSPage from "./pages/NovaOSPage";
import NovaAvariaPage from "./pages/NovaAvariaPage";
import OrdensServicoPage from "./pages/OrdensServicoPage";
import AvariasPage from "./pages/AvariasPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/clientes/novo" element={<NovoClientePage />} />
            <Route path="/analistas" element={<AnalistasPage />} />
            <Route path="/analistas/novo" element={<NovoAnalistaPage />} />
            <Route path="/ordens-servico" element={<OrdensServicoPage />} />
            <Route path="/ordens-servico/nova" element={<NovaOSPage />} />
            <Route path="/avarias" element={<AvariasPage />} />
            <Route path="/avarias/nova" element={<NovaAvariaPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/configuracoes" element={<ConfiguracoesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
