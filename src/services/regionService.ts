import { z } from "zod";
import { httpClient } from "./http";
import type {
  // Region,
  CreateRegionPayload,
  UpdateRegionPayload,
  AssignLanguagesPayload,
  UnassignLanguagesPayload,
  RegionResponse,
  GetRegionsResponse,
  CreateRegionResponse,
  Region,
  UpdateRegionResponse,
} from "@/types/region";
import { handleApiError } from "@/utils/errorHandler";

// ============================================
// SCHÉMAS DE VALIDATION ZOD
// ============================================

const createRegionSchema = z.object({
  name: z.string().min(1, "Le nom de la région est requis"),
  location: z.string().min(1, "La localisation est requise"),
  // longitude: z.number().min(-180).max(180, "Longitude invalide"),
  // latitude: z.number().min(-90).max(90, "Latitude invalide"),
});

const updateRegionSchema = z.object({
  name: z.string().min(1, "Le nom est requis").optional(),
  location: z.string().min(1, "La localisation est requise").optional(),
  // longitude: z.number().min(-180).max(180).optional(),
  // latitude: z.number().min(-90).max(90).optional(),
});

const assignLanguagesSchema = z.object({
  languages: z
    .array(z.string())
    .min(1, "Au moins une langue doit être sélectionnée"),
});

const regionResponseSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  location: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// ============================================
// TYPES D'ERREURS
// ============================================

interface ApiErrorResponse {
  message?: string;
  status?: number;
  data?: any;
  response?: {
    data?: {
      message?: string;
    };
  };
}

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
      // Validation des données d'entrée
      createRegionSchema.parse(payload);

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

      // Validation des données d'entrée
      updateRegionSchema.parse(payload);

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
   * Assigne des langues à une région
   */
  assignLanguages: async (
    id: string,
    payload: AssignLanguagesPayload
  ): Promise<RegionResponse> => {
    try {
      if (!id) throw new Error("L'ID de la région est requis");

      // Validation
      assignLanguagesSchema.parse(payload);

      // Création du FormData
      const formData = new FormData();
      payload.languages.forEach((languageId) => {
        formData.append("languages[]", languageId);
      });

      const response = await httpClient.post<RegionResponse>(
        `/regions/assign/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // const validatedData = regionResponseSchema.parse(response.data);

      return response.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.message);
        // throw new Error(error.errors[0].message);
      }

      const apiError = error as ApiErrorResponse;
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.message ||
        "Erreur lors de l'assignation des langues";

      console.error("Erreur assignLanguages:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/regions/unassign/:id
   * Détache des langues d'une région
   */
  unassignLanguages: async (
    id: string,
    payload: UnassignLanguagesPayload
  ): Promise<RegionResponse> => {
    try {
      if (!id) throw new Error("L'ID de la région est requis");

      // Validation
      assignLanguagesSchema.parse(payload);

      // Création du FormData
      const formData = new FormData();
      payload.languages.forEach((languageId) => {
        formData.append("languages[]", languageId);
      });

      const response = await httpClient.post<RegionResponse>(
        `/regions/unassign/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // const validatedData = regionResponseSchema.parse(response.data);

      return response.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.message);
        // throw new Error(error.errors[0].message);
      }

      const apiError = error as ApiErrorResponse;
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.message ||
        "Erreur lors du détachement des langues";

      console.error("Erreur unassignLanguages:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};

// Export des schémas pour réutilisation
export {
  createRegionSchema,
  updateRegionSchema,
  assignLanguagesSchema,
  regionResponseSchema,
};
