import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import type {
  UpdateProfilePayload,
  UpdatePasswordPayload,
} from "@/types/auth";
import type { User } from "@/types/User";

// ============================================
// CUSTOM HOOK - useProfile
// ============================================

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser, logout } = useAuthStore();

  // Récupérer le profil utilisateur
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getUserProfile();
      setProfile(response.data as User);
      return response.data;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement du profil";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Modifier le profil
  const updateProfile = async (payload: UpdateProfilePayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(payload);
      setProfile(response.data);
      // Mettre à jour le store auth avec les nouvelles données
      setUser(response.data);
      toast.success("Profil modifié avec succès !");
      return response.data;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la modification du profil";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Changer le mot de passe
  const updatePassword = async (payload: UpdatePasswordPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updatePassword(payload);
      toast.success("Mot de passe modifié avec succès !");
      return response;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors du changement de mot de passe";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer le compte
  const deleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.deleteAccount();
      toast.success("Compte supprimé avec succès");
      logout();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression du compte";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle notifications pour l'utilisateur connecté
  const toggleNotification = async () => {
    try {
      await userService.toggleNotification();
      // Inverser la valeur actuelle dans le profil et le store
      const newValue = !profile?.send_notif;
      if (profile) {
        const updatedProfile = { ...profile, send_notif: newValue };
        setProfile(updatedProfile);
        setUser(updatedProfile);
      }
      const message = newValue
        ? "Notifications activées"
        : "Notifications désactivées";
      toast.success(message);
      return newValue;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la modification des notifications";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    }
  };

  // Charger le profil au montage
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updatePassword,
    deleteAccount,
    toggleNotification,
  };
};
