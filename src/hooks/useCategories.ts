import { useState, useEffect } from "react";
import { toast } from "sonner";
import { categoryService } from "@/services/categoryService";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category";

// ============================================
// CUSTOM HOOK - useCategories
// ============================================

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer toutes les catégories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des catégories";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Créer une catégorie
  const createCategory = async (payload: CreateCategoryPayload) => {
    setLoading(true);
    setError(null);
    try {
      const newCategory = await categoryService.create(payload);
      setCategories((prev) => [...prev, newCategory]);
      toast.success("Catégorie créée avec succès !");
      return newCategory;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Erreur lors de la création";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Modifier une catégorie
  const updateCategory = async (
    id: string,
    payload: UpdateCategoryPayload
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategory = await categoryService.update(id, payload);
      setCategories((prev) =>
        prev.map((category) =>
          category.id === id ? updatedCategory : category
        )
      );
      toast.success("Catégorie modifiée avec succès !");
      return updatedCategory;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Erreur lors de la modification";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une catégorie
  const deleteCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      toast.success("Catégorie supprimée avec succès !");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Erreur lors de la suppression";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger automatiquement au montage du composant
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
