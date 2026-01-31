import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import type {
  User,
  PaginationMeta,
  UsersStatistics,
} from "@/types/User";

// ============================================
// CUSTOM HOOK - useUsers
// ============================================

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [statistics, setStatistics] = useState<UsersStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les utilisateurs (paginé)
  const fetchUsers = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll(page);
      setUsers(data.users.data);
      setPagination(data.users.meta);
      setStatistics(data.statistics);
      return data;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des utilisateurs";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle notifications pour l'utilisateur connecté
  const toggleNotification = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.toggleNotification();
      toast.success(response.message || "État de notification modifié");
      return response;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la modification des notifications";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Changer de page
  const goToPage = async (page: number) => {
    await fetchUsers(page);
  };

  // Charger automatiquement au montage
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    pagination,
    statistics,
    loading,
    error,
    fetchUsers,
    toggleNotification,
    goToPage,
  };
};
