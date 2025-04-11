
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateTest from "./pages/CreateTest";
import TakeTest from "./pages/TakeTest";
import TestResults from "./pages/TestResults";
import NotFound from "./pages/NotFound";
import NavbarLayout from "./components/layouts/NavbarLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavbarLayout><Index /></NavbarLayout>} />
          <Route path="/create" element={<NavbarLayout><CreateTest /></NavbarLayout>} />
          <Route path="/take" element={<NavbarLayout><TakeTest /></NavbarLayout>} />
          <Route path="/results/:id" element={<NavbarLayout><TestResults /></NavbarLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
