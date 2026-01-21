// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Pages
// import Login from "./pages/auth/se-connecter";
import Dashboard from "./pages/Dashboard";
import Traditions from "./pages/Traditions";
import Informateurs from "./pages/Informateurs";
import Langues from "./pages/Langues";
import Regions from "./pages/Regions";
import Users from "./pages/Users";
import Moderation from "./pages/Moderation";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
// import Register from "./pages/auth/s-inscrire";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <Toaster /> */}
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/se-connecter" element={<Login />} />
          <Route path="/s-inscrire" element={<Register />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/se-connecter" replace />} />

          {/* Protected Routes (simulated) */}
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/traditions" element={<Traditions />} />
            <Route path="/informateurs" element={<Informateurs />} />
            <Route path="/langues" element={<Langues />} />
            <Route path="/regions" element={<Regions />} />
            <Route path="/users" element={<Users />} />
            <Route path="/moderation" element={<Moderation />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
