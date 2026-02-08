import { httpClient } from "./http";
import type {
  CreateRegionPayload,
  UpdateRegionPayload,
  AssignLanguagesPayload,
  UnassignLanguagesPayload,
  AssignLanguagesResponse,
  UnassignLanguagesResponse,
  GetRegionsResponse,
  CreateRegionResponse,
  Region,
  UpdateRegionResponse,
} from "@/types/region";
import { handleApiError } from "@/utils/errorHandler";

// ============================================
// SERVICE REGION
// ============================================

export const regionService = {
  /**
   * GET /api/regions
   * Liste toutes les régions
   */
  getAll: async (): Promise<Region[]> => {
    try {
      const response = await httpClient.get<GetRegionsResponse>("/regions");
      return response.data.regions;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la récupération des régions"
      );
      console.error("Erreur getAll regions:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * GET /api/regions/:id
   * Récupère une région spécifique
   */
  // getById: async (id: string): Promise<RegionResponse> => {
  //   try {
  //     if (!id) throw new Error("L'ID de la région est requis");

  //     const response = await httpClient.get<RegionResponse>(`/regions/${id}`);

  //     const validatedData = regionResponseSchema.parse(response.data);

  //     return validatedData;
  //   } catch (error) {
  //     const apiError = error as ApiErrorResponse;
  //     const errorMessage =
  //       apiError.response?.data?.message ||
  //       apiError.message ||
  //       "Erreur lors de la récupération de la région";

  //     console.error("Erreur getById region:", errorMessage);
  //     throw new Error(errorMessage);
  //   }
  // },

  /**
   * POST /api/regions
   * Crée une nouvelle région
   */
  create: async (payload: CreateRegionPayload): Promise<Region> => {
    try {
      const response = await httpClient.post<CreateRegionResponse>(
        "/regions",
        payload
      );

      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la création de la région"
      );
      console.error("Erreur create region:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * PUT /api/regions/:id
   * Modifie une région existante
   */
  update: async (id: string, payload: UpdateRegionPayload): Promise<Region> => {
    try {
      if (!id) throw new Error("L'ID de la région est requis");

      const response = await httpClient.put<UpdateRegionResponse>(
        `/regions/${id}`,
        payload
      );

      return response.data.region;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la modification de la région"
      );
      console.error("Erreur update region:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * DELETE /api/regions/:id
   * Supprime une région
   */
  delete: async (id: string): Promise<void> => {
    try {
      if (!id) throw new Error("L'ID de la région est requis");

      await httpClient.delete(`/regions/${id}`);
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la suppression de la région"
      );
      console.error("Erreur delete region:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/regions/assign/:id
   * Assigne une ou plusieurs langues à une région
   */
  assignLanguages: async (
    id: string,
    payload: AssignLanguagesPayload
  ): Promise<AssignLanguagesResponse> => {
    try {
      if (!id) throw new Error("L'ID de la région est requis");

      const response = await httpClient.post<AssignLanguagesResponse>(
        `/regions/assign/${id}`,
        payload
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de l'assignation des langues"
      );
      console.error("Erreur assignLanguages:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/regions/unassign/:id
   * Détache une ou plusieurs langues d'une région
   */
  unassignLanguages: async (
    id: string,
    payload: UnassignLanguagesPayload
  ): Promise<UnassignLanguagesResponse> => {
    try {
      if (!id) throw new Error("L'ID de la région est requis");

      const response = await httpClient.post<UnassignLanguagesResponse>(
        `/regions/unassign/${id}`,
        payload
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors du détachement des langues"
      );
      console.error("Erreur unassignLanguages:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
