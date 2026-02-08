import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { traditionService } from "@/services/traditionService";
import type {
  CreateTraditionPayload,
  UpdateTraditionPayload,
  TraditionsFilterParams,
} from "@/types/tradition";

// ============================================
// QUERY KEYS
// ============================================

export const traditionKeys = {
  all: ["traditions"] as const,
  list: (params?: TraditionsFilterParams) => ["traditions", "list", params] as const,
  detail: (id: string) => ["traditions", "detail", id] as const,
  popular: ["traditions", "popular"] as const,
};

// ============================================
// CUSTOM HOOK - useTraditions
// ============================================

export const useTraditions = (params?: TraditionsFilterParams) => {
  const queryClient = useQueryClient();

  // ============================================
  // QUERIES
  // ============================================

  /**
   * Récupérer les traditions avec pagination et filtres
   */
  const traditionsQuery = useQuery({
    queryKey: traditionKeys.list(params),
    queryFn: () => traditionService.getAll(params),
  });

  /**
   * Récupérer les traditions populaires
   */
  const popularQuery = useQuery({
    queryKey: traditionKeys.popular,
    queryFn: traditionService.getPopular,
  });

  // ============================================
  // MUTATIONS - CRUD
  // ============================================

  /**
   * Créer une nouvelle tradition
   */
  const createTraditionMutation = useMutation({
    mutationFn: (payload: CreateTraditionPayload) => traditionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: traditionKeys.all });
      toast.success("Tradition créée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création de la tradition");
    },
  });

  /**
   * Modifier une tradition
   */
  const updateTraditionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTraditionPayload }) =>
      traditionService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: traditionKeys.all });
      toast.success("Tradition modifiée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la modification de la tradition");
    },
  });

  /**
   * Supprimer une tradition
   */
  const deleteTraditionMutation = useMutation({
    mutationFn: (id: string) => traditionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: traditionKeys.all });
      toast.success("Tradition supprimée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression de la tradition");
    },
  });

  // ============================================
  // MUTATIONS - STATUS
  // ============================================

  /**
   * Valider une tradition
   */
  const validateTraditionMutation = useMutation({
    mutationFn: (id: string) => traditionService.validate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: traditionKeys.all });
      toast.success("Tradition validée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la validation");
    },
  });

  /**
   * Rejeter une tradition
   */
  const rejectTraditionMutation = useMutation({
    mutationFn: (id: string) => traditionService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: traditionKeys.all });
      toast.success("Tradition rejetée !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors du rejet");
    },
  });

  /**
   * Archiver une tradition
   */
  const archiveTraditionMutation = useMutation({
    mutationFn: (id: string) => traditionService.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: traditionKeys.all });
      toast.success("Tradition archivée !");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'archivage");
    },
  });

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const createTradition = (payload: CreateTraditionPayload) =>
    createTraditionMutation.mutateAsync(payload);

  const updateTradition = (id: string, payload: UpdateTraditionPayload) =>
    updateTraditionMutation.mutateAsync({ id, payload });

  const deleteTradition = (id: string) =>
    deleteTraditionMutation.mutateAsync(id);

  const validateTradition = (id: string) =>
    validateTraditionMutation.mutateAsync(id);

  const rejectTradition = (id: string) =>
    rejectTraditionMutation.mutateAsync(id);

  const archiveTradition = (id: string) =>
    archiveTraditionMutation.mutateAsync(id);

  return {
    // Data
    traditions: traditionsQuery.data?.traditions ?? [],
    meta: traditionsQuery.data?.meta ?? { total: 0, perPage: 4, currentPage: 1 },
    popularTraditions: popularQuery.data ?? [],

    // Loading states
    loading: traditionsQuery.isLoading,
    isCreating: createTraditionMutation.isPending,
    isUpdating: updateTraditionMutation.isPending,
    isDeleting: deleteTraditionMutation.isPending,

    // Error
    error: traditionsQuery.error?.message || null,

    // Queries
    traditionsQuery,
    popularQuery,

    // Mutations
    createTraditionMutation,
    updateTraditionMutation,
    deleteTraditionMutation,
    validateTraditionMutation,
    rejectTraditionMutation,
    archiveTraditionMutation,

    // Helper functions
    refetch: traditionsQuery.refetch,
    createTradition,
    updateTradition,
    deleteTradition,
    validateTradition,
    rejectTradition,
    archiveTradition,
  };
};

// ============================================
// HOOK - useTradition (single)
// ============================================

export const useTradition = (id: string) => {
  const traditionQuery = useQuery({
    queryKey: traditionKeys.detail(id),
    queryFn: () => traditionService.getById(id),
    enabled: !!id,
  });

  return {
    tradition: traditionQuery.data,
    loading: traditionQuery.isLoading,
    error: traditionQuery.error?.message || null,
    traditionQuery,
  };
};
