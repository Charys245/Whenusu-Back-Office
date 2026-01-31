import { httpClient } from "./http";
import { handleApiError } from "@/utils/errorHandler";
import type {
  Role,
  Permission,
  CreateRolePayload,
  CreateRoleResponse,
  CreatePermissionPayload,
  CreatePermissionResponse,
  RolePermissionPayload,
  RolePermissionResponse,
  UserRolesPayload,
  UserRolesResponse,
  GetRolesResponse,
  GetPermissionsResponse,
} from "@/types/Role";

// ============================================
// SERVICE RÔLES & PERMISSIONS
// ============================================

export const roleService = {
  // ============================================
  // RÔLES
  // ============================================

  /**
   * GET /api/roles
   * Liste tous les rôles
   * ⚠️ ENDPOINT PAS ENCORE DISPONIBLE CÔTÉ BACKEND
   */
  getAll: async (): Promise<Role[]> => {
    try {
      const response = await httpClient.get<GetRolesResponse>("/roles");
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la récupération des rôles"
      );
      console.error("Erreur getAll roles:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/roles/
   * Créer un nouveau rôle
   */
  create: async (payload: CreateRolePayload): Promise<Role> => {
    try {
      const response = await httpClient.post<CreateRoleResponse>(
        "/roles/",
        payload
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la création du rôle"
      );
      console.error("Erreur create role:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/roles/assign/:id
   * Assigner une permission à un rôle
   * @param roleId - ID du rôle
   * @param payload - { permissionId: string }
   */
  assignPermission: async (
    roleId: string,
    payload: RolePermissionPayload
  ): Promise<Role> => {
    try {
      const response = await httpClient.post<RolePermissionResponse>(
        `/roles/assign/${roleId}`,
        payload
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de l'assignation de la permission"
      );
      console.error("Erreur assignPermission:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/roles/unassign/:id
   * Retirer une permission d'un rôle
   * @param roleId - ID du rôle
   * @param payload - { permissionId: string }
   */
  unassignPermission: async (
    roleId: string,
    payload: RolePermissionPayload
  ): Promise<Role> => {
    try {
      const response = await httpClient.post<RolePermissionResponse>(
        `/roles/unassign/${roleId}`,
        payload
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors du retrait de la permission"
      );
      console.error("Erreur unassignPermission:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // ============================================
  // PERMISSIONS
  // ============================================

  /**
   * GET /api/permissions
   * Liste toutes les permissions
   * ⚠️ ENDPOINT PAS ENCORE DISPONIBLE CÔTÉ BACKEND
   */
  getAllPermissions: async (): Promise<Permission[]> => {
    try {
      const response =
        await httpClient.get<GetPermissionsResponse>("/permissions");
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la récupération des permissions"
      );
      console.error("Erreur getAll permissions:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/permissions/
   * Créer une nouvelle permission
   */
  createPermission: async (
    payload: CreatePermissionPayload
  ): Promise<Permission> => {
    try {
      const response = await httpClient.post<CreatePermissionResponse>(
        "/permissions/",
        payload
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la création de la permission"
      );
      console.error("Erreur create permission:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // ============================================
  // USER ↔ RÔLE
  // ============================================

  /**
   * POST /api/auth/assign-role/:id
   * Assigner un ou plusieurs rôles à un utilisateur
   * @param userId - ID de l'utilisateur
   * @param payload - { rolesId: string[] }
   */
  assignRolesToUser: async (
    userId: string,
    payload: UserRolesPayload
  ): Promise<UserRolesResponse> => {
    try {
      const response = await httpClient.post<UserRolesResponse>(
        `/auth/assign-role/${userId}`,
        payload
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de l'assignation du rôle"
      );
      console.error("Erreur assignRolesToUser:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/auth/unassign-role/:id
   * Retirer un ou plusieurs rôles d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @param payload - { rolesId: string[] }
   */
  unassignRolesFromUser: async (
    userId: string,
    payload: UserRolesPayload
  ): Promise<UserRolesResponse> => {
    try {
      const response = await httpClient.post<UserRolesResponse>(
        `/auth/unassign-role/${userId}`,
        payload
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors du retrait du rôle"
      );
      console.error("Erreur unassignRolesFromUser:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
