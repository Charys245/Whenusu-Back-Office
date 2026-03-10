// types/Role.ts

/**
 * Interface pour une permission
 * Supporte les deux formats: snake_case et camelCase
 */
export interface Permission {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  // snake_case (ancien format)
  created_at?: string;
  updated_at?: string;
  // camelCase (nouveau format API)
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interface pour un rôle
 * Supporte les deux formats: snake_case et camelCase
 */
export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  // snake_case (ancien format)
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  // camelCase (nouveau format API)
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  // Permissions du rôle
  permissions?: Permission[];
}

// ============================================
// PAYLOADS
// ============================================

/**
 * Payload pour créer un rôle
 */
export interface CreateRolePayload {
  name: string;
  slug: string;
  description?: string;
}

/**
 * Payload pour créer une permission
 */
export interface CreatePermissionPayload {
  name: string;
  slug: string;
  description?: string;
}

/**
 * Payload pour assigner/retirer une permission d'un rôle
 */
export interface RolePermissionPayload {
  permissionId: string;
}

/**
 * Payload pour assigner/retirer des rôles d'un user
 */
export interface UserRolesPayload {
  rolesId: string[];
}

// ============================================
// RESPONSES
// ============================================

/**
 * Réponse création de rôle
 */
export interface CreateRoleResponse {
  message: string;
  data: Role;
}

/**
 * Réponse création de permission
 */
export interface CreatePermissionResponse {
  message: string;
  data: Permission;
}

/**
 * Réponse assignation/retrait permission-rôle
 */
export interface RolePermissionResponse {
  message: string;
  data: Role;
}

/**
 * Réponse assignation/retrait rôle-user
 */
export interface UserRolesResponse {
  message: string;
  data: {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    phoneNumber: string;
    avatarUrl?: string;
  };
}

/**
 * Réponse liste des rôles
 * L'API retourne directement un tableau de rôles
 */
export type GetRolesResponse = Role[];

/**
 * Réponse liste des permissions (préparé pour quand l'endpoint existera)
 */
export interface GetPermissionsResponse {
  message: string;
  data: Permission[];
}
