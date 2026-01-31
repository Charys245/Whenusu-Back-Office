import { httpClient } from "./http";
import { handleApiError } from "@/utils/errorHandler";
import type {
  GetUsersResponse,
  PaginatedUsers,
  UsersStatistics,
  ToggleNotificationResponse,
} from "@/types/User";

// ============================================
// SERVICE USERS
// ============================================

export const userService = {
  /**
   * GET /api/users
   * Liste paginée des utilisateurs avec statistiques
   * @param page - Numéro de page (défaut: 1)
   */
  getAll: async (
    page: number = 1,
    perPage: number = 100
  ): Promise<{
    users: PaginatedUsers;
    statistics: UsersStatistics;
  }> => {
    try {
      const response = await httpClient.get<GetUsersResponse>("/users", {
        params: { page, perPage },
      });

      return {
        users: response.data.data,
        statistics: response.data.statistics,
      };
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la récupération des utilisateurs"
      );
      console.error("Erreur getAll users:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/users
   * Toggle le statut d'envoi de notifications pour l'utilisateur connecté
   */
  toggleNotification: async (): Promise<ToggleNotificationResponse> => {
    try {
      const response = await httpClient.post<ToggleNotificationResponse>(
        "/users"
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la modification des notifications"
      );
      console.error("Erreur toggleNotification:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
