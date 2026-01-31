import { useState, useCallback } from "react";
import { toast } from "sonner";
import { roleService } from "@/services/roleService";
import type {
  Role,
  Permission,
  CreateRolePayload,
  CreatePermissionPayload,
  UserRolesPayload,
} from "@/types/Role";

// ============================================
// CUSTOM HOOK - useRoles
// ============================================

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // RÔLES
  // ============================================

  /**
   * Récupérer tous les rôles
   * ⚠️ ENDPOINT PAS ENCORE DISPONIBLE CÔTÉ BACKEND
   */
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roleService.getAll();
      setRoles(data);
      return data;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des rôles";
      setError(errorMsg);
      // Ne pas afficher de toast car l'endpoint n'existe pas encore
      console.warn("fetchRoles:", errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Créer un nouveau rôle
   */
  const createRole = async (payload: CreateRolePayload) => {
    setLoading(true);
    setError(null);
    try {
      const newRole = await roleService.create(payload);
      setRoles((prev) => [...prev, newRole]);
      toast.success("Rôle créé avec succès");
      return newRole;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la création du rôle";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Assigner une permission à un rôle
   */
  const assignPermissionToRole = async (
    roleId: string,
    permissionId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRole = await roleService.assignPermission(roleId, {
        permissionId,
      });
      setRoles((prev) =>
        prev.map((role) => (role.id === roleId ? updatedRole : role))
      );
      toast.success("Permission assignée avec succès");
      return updatedRole;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'assignation de la permission";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retirer une permission d'un rôle
   */
  const unassignPermissionFromRole = async (
    roleId: string,
    permissionId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRole = await roleService.unassignPermission(roleId, {
        permissionId,
      });
      setRoles((prev) =>
        prev.map((role) => (role.id === roleId ? updatedRole : role))
      );
      toast.success("Permission retirée avec succès");
      return updatedRole;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors du retrait de la permission";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // PERMISSIONS
  // ============================================

  /**
   * Récupérer toutes les permissions
   * ⚠️ ENDPOINT PAS ENCORE DISPONIBLE CÔTÉ BACKEND
   */
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roleService.getAllPermissions();
      setPermissions(data);
      return data;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des permissions";
      setError(errorMsg);
      // Ne pas afficher de toast car l'endpoint n'existe pas encore
      console.warn("fetchPermissions:", errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Créer une nouvelle permission
   */
  const createPermission = async (payload: CreatePermissionPayload) => {
    setLoading(true);
    setError(null);
    try {
      const newPermission = await roleService.createPermission(payload);
      setPermissions((prev) => [...prev, newPermission]);
      toast.success("Permission créée avec succès");
      return newPermission;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de la permission";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // USER ↔ RÔLE
  // ============================================

  /**
   * Assigner des rôles à un utilisateur
   */
  const assignRolesToUser = async (userId: string, rolesId: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const payload: UserRolesPayload = { rolesId };
      const response = await roleService.assignRolesToUser(userId, payload);
      toast.success(response.message || "Rôle(s) assigné(s) avec succès");
      return response;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'assignation du rôle";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retirer des rôles d'un utilisateur
   */
  const unassignRolesFromUser = async (userId: string, rolesId: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const payload: UserRolesPayload = { rolesId };
      const response = await roleService.unassignRolesFromUser(userId, payload);
      toast.success(response.message || "Rôle(s) retiré(s) avec succès");
      return response;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors du retrait du rôle";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    roles,
    permissions,
    loading,
    error,
    // Rôles
    fetchRoles,
    createRole,
    assignPermissionToRole,
    unassignPermissionFromRole,
    // Permissions
    fetchPermissions,
    createPermission,
    // User ↔ Rôle
    assignRolesToUser,
    unassignRolesFromUser,
  };
};
