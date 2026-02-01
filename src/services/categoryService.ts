import { handleApiError } from "@/utils/errorHandler";
import { httpClient } from "./http";
import type {
  CreateCategoryPayload,
  CreateCategoryResponse,
  DeleteCategoryResponse,
  GetCategoriesResponse,
  Category,
  UpdateCategoryPayload,
  UpdateCategoryResponse,
} from "@/types/category";

// ============================================
// SERVICE CATEGORY
// ============================================

export const categoryService = {
  /**
   * GET /api/categories
   * Liste toutes les catégories
   */
  getAll: async (): Promise<Category[]> => {
    try {
      const response =
        await httpClient.get<GetCategoriesResponse>("/categories");
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la récupération des catégories"
      );
      console.error("Erreur getAll categories:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/categories
   * Crée une nouvelle catégorie
   */
  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    try {
      const response = await httpClient.post<CreateCategoryResponse>(
        "/categories",
        payload
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la création de la catégorie"
      );
      console.error("Erreur create category:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * PUT /api/categories/:id
   * Modifie une catégorie existante
   */
  update: async (
    id: string,
    payload: UpdateCategoryPayload
  ): Promise<Category> => {
    try {
      if (!id) throw new Error("L'ID de la catégorie est requis");

      const response = await httpClient.put<UpdateCategoryResponse>(
        `/categories/${id}`,
        payload
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la modification de la catégorie"
      );
      console.error("Erreur update category:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * DELETE /api/categories/:id
   * Supprime une catégorie
   */
  delete: async (id: string): Promise<void> => {
    try {
      if (!id) throw new Error("L'ID de la catégorie est requis");

      await httpClient.delete<DeleteCategoryResponse>(`/categories/${id}`);
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la suppression de la catégorie"
      );
      console.error("Erreur delete category:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
