import { type ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [loading, setLoading] = useState(true);

  // Simule une vérification d'authentification
  useEffect(() => {
    // Simule une attente de vérification de l'authentification
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // Délai de 100ms, ajuste comme nécessaire
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Affiche un indicateur de chargement
  }

  if (!isAuthenticated) {
    return <Navigate to="/se-connecter" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
