import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PassageProvider } from "@/contexts/PassageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PassageReader from "./pages/PassageReader";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ChatButton from "./components/ChatButton";
import ChatDrawer from "./components/ChatDrawer";

const queryClient = new QueryClient();

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PassageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Index />} />
                <Route path="/passage" element={<PassageReader />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatButton onClick={() => setIsChatOpen(true)} />
              <ChatDrawer open={isChatOpen} onClose={() => setIsChatOpen(false)} />
            </BrowserRouter>
          </PassageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
