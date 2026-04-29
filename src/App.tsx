import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import QRGenerator from "./pages/QRGenerator.tsx";
import { useConfigState } from "./context/ConfigContext.tsx";

const queryClient = new QueryClient();

// Wrapper que maneja loading/error del config antes de renderizar la carta
const ConfigGate = ({ children }: { children: React.ReactNode }) => {
  const state = useConfigState();

  if (state.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Cargando carta…</p>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8">
        <div className="max-w-sm text-center">
          <p className="font-display text-2xl text-foreground">No se pudo cargar la carta</p>
          <p className="mt-3 text-sm text-muted-foreground">{state.message}</p>
          <p className="mt-6 text-xs text-muted-foreground">Asegúrate de que existe un archivo <code className="font-mono">config.json</code> en la raíz del servidor.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* La carta requiere config cargado */}
          <Route
            path="/"
            element={
              <ConfigGate>
                <Index />
              </ConfigGate>
            }
          />
          {/* Generador de QR — uso interno Rodorte, no requiere config */}
          <Route path="/qr" element={<QRGenerator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
