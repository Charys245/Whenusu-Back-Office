import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { languageService } from "@/services/languageService";
import type {
  CreateLanguagePayload,
  UpdateLanguagePayload,
} from "@/types/language";

// ============================================
// QUERY KEYS
// ============================================

export const languageKeys = {
  all: ["languages"] as const,
  detail: (id: string) => ["languages", id] as const,
};

// ============================================
// CUSTOM HOOK - useLanguages
// ============================================

export const useLanguages = () => {
  const queryClient = useQueryClient();

  // ============================================
  // QUERIES
  // ============================================

  /**
   * Récupérer toutes les langues
   */
  const languagesQuery = useQuery({
    queryKey: languageKeys.all,
    queryFn: languageService.getAll,
  });

  // ============================================
  // MUTATIONS
  // ============================================

  /**
   * Créer une nouvelle langue
   */
  const createLanguageMutation = useMutation({
    mutationFn: (payload: CreateLanguagePayload) => languageService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: languageKeys.all });
      toast.success("Langue créée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création de la langue");
    },
  });

  /**
   * Modifier une langue
   */
  const updateLanguageMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLanguagePayload }) =>
      languageService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: languageKeys.all });
      toast.success("Langue modifiée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la modification de la langue");
    },
  });

  /**
   * Supprimer une langue
   */
  const deleteLanguageMutation = useMutation({
    mutationFn: (id: string) => languageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: languageKeys.all });
      toast.success("Langue supprimée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression de la langue");
    },
  });

  // ============================================
  // HELPER FUNCTIONS (pour compatibilité)
  // ============================================

  const createLanguage = (payload: CreateLanguagePayload) =>
    createLanguageMutation.mutateAsync(payload);

  const updateLanguage = (id: string, payload: UpdateLanguagePayload) =>
    updateLanguageMutation.mutateAsync({ id, payload });

  const deleteLanguage = (id: string) =>
    deleteLanguageMutation.mutateAsync(id);

  return {
    // State (compatibilité avec l'ancienne API)
    languages: languagesQuery.data ?? [],
    loading: languagesQuery.isLoading,
    error: languagesQuery.error?.message || null,

    // Query (nouvelle API React Query)
    languagesQuery,

    // Mutations (nouvelle API React Query)
    createLanguageMutation,
    updateLanguageMutation,
    deleteLanguageMutation,

    // Helper functions (compatibilité avec l'ancienne API)
    fetchLanguages: languagesQuery.refetch,
    createLanguage,
    updateLanguage,
    deleteLanguage,
  };
};
