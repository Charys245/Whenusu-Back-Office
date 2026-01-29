import { handleApiError } from "@/utils/errorHandler";
import { httpClient } from "./http";
import type {
  CreateLanguagePayload,
  CreateLanguageResponse,
  DeleteLanguageResponse,
  GetLanguagesResponse,
  Language,
  UpdateLanguagePayload,
  UpdateLanguageResponse,
} from "@/types/language";

// ============================================
// TYPES D'ERREURS
// ============================================

// interface ApiErrorResponse {
//   message?: string;
//   status?: number;
//   data?: any;
//   response?: {
//     data?: {
//       message?: string;
//     };
//   };
// }

// ============================================
// SERVICE LANGUAGE
// ============================================

export const languageService = {
  /**
   * GET /api/languages
   * Liste toutes les langues
   */
  getAll: async (): Promise<Language[]> => {
    try {
      const response = await httpClient.get<GetLanguagesResponse>("/languages");
      return response.data.languages;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la récupération des langues"
      );
      console.error("Erreur getAll languages:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/languages
   * Crée une nouvelle langue
   */
  create: async (payload: CreateLanguagePayload): Promise<Language> => {
    try {
      const response = await httpClient.post<CreateLanguageResponse>(
        "/languages",
        payload
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la création de la langue"
      );
      console.error("Erreur create language:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * PUT /api/languages/:id
   * Modifie une langue existante
   */
  update: async (
    id: string,
    payload: UpdateLanguagePayload
  ): Promise<Language> => {
    try {
      if (!id) throw new Error("L'ID de la langue est requis");

      const response = await httpClient.put<UpdateLanguageResponse>(
        `/languages/${id}`,
        payload
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la modification de la langue"
      );
      console.error("Erreur update language:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * DELETE /api/languages/:id
   * Supprime une langue
   */
  delete: async (id: string): Promise<void> => {
    try {
      if (!id) throw new Error("L'ID de la langue est requis");

      await httpClient.delete<DeleteLanguageResponse>(`/languages/${id}`);
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la suppression de la langue"
      );
      console.error("Erreur delete language:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
