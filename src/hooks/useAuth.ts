import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/store/authStore";

/** Hook pour vérifier si connecté */
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

/** Hook pour récupérer l'utilisateur */
export const useCurrentUser = () => useAuthStore((state) => state.user);

/** Hook pour les actions */
export const useAuthActions = () =>
  useAuthStore(
    useShallow((state) => ({
      setCredentials: state.setCredentials,
      logout: state.logout,
    }))
  );

/** Hook pour logout uniquement */
export const useLogout = () => useAuthStore((state) => state.logout);

/** Hook pour nom complet */
export const useUserFullName = () =>
  useAuthStore((state) => state.getFullName());

/** Hook pour initiales */
export const useUserInitials = () =>
  useAuthStore((state) => state.getInitials());
