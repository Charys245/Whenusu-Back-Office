import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { regionService } from "@/services/regionService";
import type {
  CreateRegionPayload,
  UpdateRegionPayload,
} from "@/types/region";

// ============================================
// QUERY KEYS
// ============================================

export const regionKeys = {
  all: ["regions"] as const,
  detail: (id: string) => ["regions", id] as const,
};

// ============================================
// CUSTOM HOOK - useRegions
// ============================================

export const useRegions = () => {
  const queryClient = useQueryClient();

  // ============================================
  // QUERIES
  // ============================================

  /**
   * Récupérer toutes les régions (avec leurs langues préchargées)
   */
  const regionsQuery = useQuery({
    queryKey: regionKeys.all,
    queryFn: regionService.getAll,
  });

  // ============================================
  // MUTATIONS - CRUD
  // ============================================

  /**
   * Créer une nouvelle région
   */
  const createRegionMutation = useMutation({
    mutationFn: (payload: CreateRegionPayload) => regionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionKeys.all });
      toast.success("Région créée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création de la région");
    },
  });

  /**
   * Modifier une région
   */
  const updateRegionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRegionPayload }) =>
      regionService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionKeys.all });
      toast.success("Région modifiée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la modification de la région");
    },
  });

  /**
   * Supprimer une région
   */
  const deleteRegionMutation = useMutation({
    mutationFn: (id: string) => regionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionKeys.all });
      toast.success("Région supprimée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression de la région");
    },
  });

  // ============================================
  // MUTATIONS - LANGUES
  // ============================================

  /**
   * Assigner une ou plusieurs langues à une région
   */
  const assignLanguagesMutation = useMutation({
    mutationFn: ({ regionId, languages }: { regionId: string; languages: string[] }) =>
      regionService.assignLanguages(regionId, { languages }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionKeys.all });
      toast.success("Langue(s) assignée(s) avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'assignation des langues");
    },
  });

  /**
   * Détacher une ou plusieurs langues d'une région
   */
  const unassignLanguagesMutation = useMutation({
    mutationFn: ({ regionId, languages }: { regionId: string; languages: string[] }) =>
      regionService.unassignLanguages(regionId, { languages }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionKeys.all });
      toast.success("Langue(s) détachée(s) avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors du détachement des langues");
    },
  });

  // ============================================
  // HELPER FUNCTIONS (pour compatibilité)
  // ============================================

  const createRegion = (payload: CreateRegionPayload) =>
    createRegionMutation.mutateAsync(payload);

  const updateRegion = (id: string, payload: UpdateRegionPayload) =>
    updateRegionMutation.mutateAsync({ id, payload });

  const deleteRegion = (id: string) =>
    deleteRegionMutation.mutateAsync(id);

  const assignLanguages = (regionId: string, languageId: string) =>
    assignLanguagesMutation.mutateAsync({ regionId, languages: [languageId] });

  const unassignLanguages = (regionId: string, languageId: string) =>
    unassignLanguagesMutation.mutateAsync({ regionId, languages: [languageId] });

  return {
    // State (compatibilité avec l'ancienne API)
    regions: regionsQuery.data ?? [],
    loading: regionsQuery.isLoading,
    error: regionsQuery.error?.message || null,

    // Query (nouvelle API React Query)
    regionsQuery,

    // Mutations (nouvelle API React Query)
    createRegionMutation,
    updateRegionMutation,
    deleteRegionMutation,
    assignLanguagesMutation,
    unassignLanguagesMutation,

    // Helper functions (compatibilité avec l'ancienne API)
    fetchRegions: regionsQuery.refetch,
    createRegion,
    updateRegion,
    deleteRegion,
    assignLanguages,
    unassignLanguages,
  };
};
