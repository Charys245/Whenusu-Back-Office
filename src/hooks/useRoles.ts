import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { roleService } from "@/services/roleService";
import type {
  CreateRolePayload,
  CreatePermissionPayload,
} from "@/types/Role";

// ============================================
// QUERY KEYS
// ============================================

export const roleKeys = {
  all: ["roles"] as const,
  permissions: ["permissions"] as const,
};

// ============================================
// CUSTOM HOOK - useRoles
// ============================================

export const useRoles = () => {
  const queryClient = useQueryClient();

  // ============================================
  // QUERIES
  // ============================================

  /**
   * Récupérer tous les rôles
   */
  const rolesQuery = useQuery({
    queryKey: roleKeys.all,
    queryFn: roleService.getAll,
  });

  /**
   * Récupérer toutes les permissions
   */
  const permissionsQuery = useQuery({
    queryKey: roleKeys.permissions,
    queryFn: roleService.getAllPermissions,
  });

  // ============================================
  // MUTATIONS - RÔLES
  // ============================================

  /**
   * Créer un nouveau rôle
   */
  const createRoleMutation = useMutation({
    mutationFn: (payload: CreateRolePayload) => roleService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      toast.success("Rôle créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du rôle");
    },
  });

  /**
   * Assigner une permission à un rôle
   */
  const assignPermissionMutation = useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: string; permissions: string[] }) =>
      roleService.assignPermission(roleId, { permissions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      toast.success("Permission assignée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'assignation de la permission");
    },
  });

  /**
   * Retirer une permission d'un rôle
   */
  const unassignPermissionMutation = useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: string; permissions: string[] }) =>
      roleService.unassignPermission(roleId, { permissions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      toast.success("Permission retirée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors du retrait de la permission");
    },
  });

  // ============================================
  // MUTATIONS - PERMISSIONS
  // ============================================

  /**
   * Créer une nouvelle permission
   */
  const createPermissionMutation = useMutation({
    mutationFn: (payload: CreatePermissionPayload) =>
      roleService.createPermission(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.permissions });
      toast.success("Permission créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création de la permission");
    },
  });

  // ============================================
  // MUTATIONS - USER ↔ RÔLE
  // ============================================

  /**
   * Assigner des rôles à un utilisateur
   */
  const assignRolesToUserMutation = useMutation({
    mutationFn: ({ userId, rolesId }: { userId: string; rolesId: string[] }) =>
      roleService.assignRolesToUser(userId, { rolesId }),
    onSuccess: (response) => {
      toast.success(response.message || "Rôle(s) assigné(s) avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'assignation du rôle");
    },
  });

  /**
   * Retirer des rôles d'un utilisateur
   */
  const unassignRolesFromUserMutation = useMutation({
    mutationFn: ({ userId, rolesId }: { userId: string; rolesId: string[] }) =>
      roleService.unassignRolesFromUser(userId, { rolesId }),
    onSuccess: (response) => {
      toast.success(response.message || "Rôle(s) retiré(s) avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors du retrait du rôle");
    },
  });

  // ============================================
  // HELPER FUNCTIONS (pour compatibilité)
  // ============================================

  const createRole = (payload: CreateRolePayload) =>
    createRoleMutation.mutateAsync(payload);

  const createPermission = (payload: CreatePermissionPayload) =>
    createPermissionMutation.mutateAsync(payload);

  const assignPermissionToRole = (roleId: string, permissionId: string) =>
    assignPermissionMutation.mutateAsync({ roleId, permissions: [permissionId] });

  const unassignPermissionFromRole = (roleId: string, permissionId: string) =>
    unassignPermissionMutation.mutateAsync({ roleId, permissions: [permissionId] });

  const assignRolesToUser = (userId: string, rolesId: string[]) =>
    assignRolesToUserMutation.mutateAsync({ userId, rolesId });

  const unassignRolesFromUser = (userId: string, rolesId: string[]) =>
    unassignRolesFromUserMutation.mutateAsync({ userId, rolesId });

  return {
    // State (compatibilité avec l'ancienne API)
    roles: rolesQuery.data ?? [],
    permissions: permissionsQuery.data ?? [],
    loading: rolesQuery.isLoading || permissionsQuery.isLoading,
    error: rolesQuery.error?.message || permissionsQuery.error?.message || null,

    // Queries (nouvelle API React Query)
    rolesQuery,
    permissionsQuery,

    // Mutations (nouvelle API React Query)
    createRoleMutation,
    createPermissionMutation,
    assignPermissionMutation,
    unassignPermissionMutation,
    assignRolesToUserMutation,
    unassignRolesFromUserMutation,

    // Helper functions (compatibilité avec l'ancienne API)
    fetchRoles: rolesQuery.refetch,
    fetchPermissions: permissionsQuery.refetch,
    createRole,
    createPermission,
    assignPermissionToRole,
    unassignPermissionFromRole,
    assignRolesToUser,
    unassignRolesFromUser,
  };
};
