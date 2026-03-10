import type { User } from "@/types/User";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ============================================
// 1. TOKEN STORE (Persisté)
// ============================================
interface TokenStore {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
      },

      clearTokens: () => {
        set({ accessToken: null, refreshToken: null });
      },
    }),
    {
      name: "whenusu-auth-tokens",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================
// 2. AUTH STORE (Persisté)
// ============================================
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  initializing: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setInitializing: (initializing: boolean) => void;

  // Action principale après login
  setCredentials: (user: User, token: string, refreshToken: string) => void;

  // Logout
  logout: () => void;

  // Helpers
  getFullName: () => string;
  getInitials: () => string;
  hasRole: (roleSlug: string) => boolean;
  hasPermission: (permissionSlug: string) => boolean;
  getUserRoles: () => string[];
  getPrimaryRole: () => string | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      initializing: true,

      // Setters basiques
      setUser: (user) => set({ user }),

      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setInitializing: (initializing) => set({ initializing }),

      // Setter complet après login
      setCredentials: (user, token, refreshToken) => {
        set({
          user,
          isAuthenticated: true,
          initializing: false,
        });
        useTokenStore.getState().setTokens(token, refreshToken);
      },

      // Logout complet
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          initializing: false,
        });
        useTokenStore.getState().clearTokens();
      },

      // Helpers (gère snake_case et camelCase de l'API)
      getFullName: () => {
        const user = get().user;
        if (!user) return "";
        const firstName = user.first_name || (user as any).firstName || "";
        const lastName = user.last_name || (user as any).lastName || "";
        return `${firstName} ${lastName}`.trim();
      },

      getInitials: () => {
        const user = get().user;
        if (!user) return "";
        const firstName = user.first_name || (user as any).firstName || "";
        const lastName = user.last_name || (user as any).lastName || "";
        const firstInitial = firstName.charAt(0)?.toUpperCase() || "";
        const lastInitial = lastName.charAt(0)?.toUpperCase() || "";
        return `${firstInitial}${lastInitial}`;
      },

      hasRole: (roleSlug: string) => {
        const user = get().user;
        if (!user?.roles) return false;
        return user.roles.some((r) => r.slug === roleSlug || r.name === roleSlug);
      },

      hasPermission: (permissionSlug: string) => {
        const user = get().user;
        if (!user?.roles) return false;
        return user.roles.some((role) =>
          role.permissions?.some((p) => p.slug === permissionSlug)
        );
      },

      getUserRoles: () => {
        const user = get().user;
        return user?.roles?.map((r) => r.slug) || [];
      },

      getPrimaryRole: () => {
        const user = get().user;
        if (!user?.roles?.length) return null;
        // Ordre de priorité des rôles
        const priority = ["super-admin", "admin", "moderateur", "historien", "expert-tradition", "informant"];
        for (const role of priority) {
          if (user.roles.some((r) => r.slug === role)) {
            return role;
          }
        }
        return user.roles[0]?.slug || null;
      },
    }),
    {
      name: "whenusu-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initializing = false;
        }
      },
    }
  )
);
