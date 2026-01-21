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
  hasRole: (role: string) => boolean;
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

      // Helpers
      getFullName: () => {
        const user = get().user;
        if (!user) return "";
        return `${user.first_name} ${user.last_name}`.trim();
      },

      getInitials: () => {
        const user = get().user;
        if (!user) return "";
        const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || "";
        const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || "";
        return `${firstInitial}${lastInitial}`;
      },

      hasRole: (role: string) => {
        const user = get().user;
        return user?.role === role;
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
