import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InstallPrompt from "@/components/InstallPrompt";
import SupportButton from "@/components/SupportButton";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import AssistentePedagogicoPage from "./pages/AssistentePedagogicoPage";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/p/:slug" element={<ProductPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/assistente-pedagogico" element={<AssistentePedagogicoPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
              <InstallPrompt />
              <SupportButton />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
