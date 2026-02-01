import { handleApiError } from "@/utils/errorHandler";
import { httpClient } from "./http";
import type {
  CreateInformateurPayload,
  CreateInformateurResponse,
  DeleteInformateurResponse,
  GetInformateursResponse,
  Informateur,
  UpdateInformateurPayload,
  UpdateInformateurResponse,
} from "@/types/informateur";

// ============================================
// SERVICE INFORMATEUR
// ============================================

export const informateurService = {
  /**
   * GET /api/informants
   * Liste tous les informateurs
   */
  getAll: async (): Promise<Informateur[]> => {
    try {
      const response =
        await httpClient.get<GetInformateursResponse>("/informants");
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la récupération des informateurs"
      );
      console.error("Erreur getAll informateurs:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/informants
   * Crée un nouvel informateur (multipart/form-data pour l'upload d'avatar)
   */
  create: async (payload: CreateInformateurPayload): Promise<Informateur> => {
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("phoneNumber", payload.phoneNumber);

      if (payload.avatar_url) {
        formData.append("avatar_url", payload.avatar_url);
      }

      const response = await httpClient.post<CreateInformateurResponse>(
        "/informants",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la création de l'informateur"
      );
      console.error("Erreur create informateur:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * PUT /api/informants/:id
   * Modifie un informateur existant (multipart/form-data pour l'upload d'avatar)
   */
  update: async (
    id: string,
    payload: UpdateInformateurPayload
  ): Promise<Informateur> => {
    try {
      if (!id) throw new Error("L'ID de l'informateur est requis");

      const formData = new FormData();

      if (payload.name !== undefined) {
        formData.append("name", payload.name);
      }
      if (payload.phoneNumber !== undefined) {
        formData.append("phoneNumber", payload.phoneNumber);
      }
      if (payload.avatar_url) {
        formData.append("avatar_url", payload.avatar_url);
      }

      const response = await httpClient.put<UpdateInformateurResponse>(
        `/informants/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la modification de l'informateur"
      );
      console.error("Erreur update informateur:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * DELETE /api/informants/:id
   * Supprime un informateur
   */
  delete: async (id: string): Promise<void> => {
    try {
      if (!id) throw new Error("L'ID de l'informateur est requis");

      await httpClient.delete<DeleteInformateurResponse>(`/informants/${id}`);
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la suppression de l'informateur"
      );
      console.error("Erreur delete informateur:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
