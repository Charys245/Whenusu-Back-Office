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
import Langues from "./pages/languages/Langues";
import Regions from "./pages/regions/Regions";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Moderation from "./pages/Moderation";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// import Register from "./pages/auth/s-inscrire";

// Liste des routes protégées
const protectedRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/traditions", element: <Traditions /> },
  { path: "/informateurs", element: <Informateurs /> },
  { path: "/langues", element: <Langues /> },
  { path: "/regions", element: <Regions /> },
  { path: "/users", element: <Users /> },
  { path: "/roles", element: <Roles /> },
  { path: "/moderation", element: <Moderation /> },
  { path: "/settings", element: <Settings /> },
];

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
            {protectedRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<ProtectedRoute>{element}</ProtectedRoute>}
              />
            ))}
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
