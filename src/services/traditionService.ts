import { httpClient } from "./http";
import { handleApiError } from "@/utils/errorHandler";
import type {
  Tradition,
  CreateTraditionPayload,
  UpdateTraditionPayload,
  TraditionsFilterParams,
  GetTraditionsResponse,
  GetTraditionResponse,
  CreateTraditionResponse,
  UpdateTraditionResponse,
  PopularTraditionsResponse,
  StatusChangeResponse,
  PaginationMeta,
} from "@/types/tradition";

// ============================================
// SERVICE TRADITIONS
// ============================================

export const traditionService = {
  /**
   * GET /api/traditions
   * Liste des traditions avec pagination et filtres
   */
  getAll: async (
    params?: TraditionsFilterParams
  ): Promise<{ traditions: Tradition[]; meta: PaginationMeta }> => {
    try {
      const response = await httpClient.get<GetTraditionsResponse>("/traditions", {
        params,
      });
      return {
        traditions: response.data.data.data,
        meta: response.data.data.meta,
      };
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la récupération des traditions"
      );
      console.error("Erreur getAll traditions:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * GET /api/traditions/:id
   * Détails d'une tradition
   */
  getById: async (id: string): Promise<Tradition> => {
    try {
      if (!id) throw new Error("L'ID de la tradition est requis");

      const response = await httpClient.get<GetTraditionResponse>(
        `/traditions/${id}`
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la récupération de la tradition"
      );
      console.error("Erreur getById tradition:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/traditions
   * Créer une tradition (multipart/form-data)
   */
  create: async (payload: CreateTraditionPayload): Promise<Tradition> => {
    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("transcription", payload.transcription);
      formData.append("language_id", payload.language_id);
      formData.append("region_id", payload.region_id);
      formData.append("category_id", payload.category_id);
      formData.append("informant_id", payload.informant_id);
      formData.append("cover_img", payload.cover_img);
      formData.append("media_url", payload.media_url);

      const response = await httpClient.post<CreateTraditionResponse>(
        "/traditions",
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
        "Erreur lors de la création de la tradition"
      );
      console.error("Erreur create tradition:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * PUT /api/traditions/:id
   * Modifier une tradition (multipart/form-data)
   */
  update: async (id: string, payload: UpdateTraditionPayload): Promise<Tradition> => {
    try {
      if (!id) throw new Error("L'ID de la tradition est requis");

      const formData = new FormData();
      if (payload.title) formData.append("title", payload.title);
      if (payload.transcription) formData.append("transcription", payload.transcription);
      if (payload.language_id) formData.append("language_id", payload.language_id);
      if (payload.region_id) formData.append("region_id", payload.region_id);
      if (payload.category_id) formData.append("category_id", payload.category_id);
      if (payload.informant_id) formData.append("informant_id", payload.informant_id);
      if (payload.cover_img) formData.append("cover_img", payload.cover_img);
      if (payload.media_url) formData.append("media_url", payload.media_url);

      const response = await httpClient.put<UpdateTraditionResponse>(
        `/traditions/${id}`,
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
        "Erreur lors de la modification de la tradition"
      );
      console.error("Erreur update tradition:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * DELETE /api/traditions/:id
   * Supprimer une tradition
   */
  delete: async (id: string): Promise<void> => {
    try {
      if (!id) throw new Error("L'ID de la tradition est requis");

      await httpClient.delete(`/traditions/${id}`);
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la suppression de la tradition"
      );
      console.error("Erreur delete tradition:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * GET /api/traditions/popular
   * Top 5 traditions par favoris_count
   */
  getPopular: async (): Promise<Tradition[]> => {
    try {
      const response = await httpClient.get<PopularTraditionsResponse>(
        "/traditions/popular"
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la récupération des traditions populaires"
      );
      console.error("Erreur getPopular:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/traditions/validate/:id
   * Valider une tradition
   */
  validate: async (id: string): Promise<Tradition> => {
    try {
      if (!id) throw new Error("L'ID de la tradition est requis");

      const response = await httpClient.post<StatusChangeResponse>(
        `/traditions/validate/${id}`
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la validation de la tradition"
      );
      console.error("Erreur validate:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/traditions/reject/:id
   * Rejeter une tradition
   */
  reject: async (id: string): Promise<Tradition> => {
    try {
      if (!id) throw new Error("L'ID de la tradition est requis");

      const response = await httpClient.post<StatusChangeResponse>(
        `/traditions/reject/${id}`
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors du rejet de la tradition"
      );
      console.error("Erreur reject:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/traditions/archive/:id
   * Archiver une tradition
   */
  archive: async (id: string): Promise<Tradition> => {
    try {
      if (!id) throw new Error("L'ID de la tradition est requis");

      const response = await httpClient.post<StatusChangeResponse>(
        `/traditions/archive/${id}`
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de l'archivage de la tradition"
      );
      console.error("Erreur archive:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
