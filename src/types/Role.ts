// types/Role.ts

/**
 * Interface pour une permission
 */
export interface Permission {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface pour un rôle
 */
export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdBy?: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
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
 * Réponse liste des rôles (préparé pour quand l'endpoint existera)
 */
export interface GetRolesResponse {
  message: string;
  data: Role[];
}

/**
 * Réponse liste des permissions (préparé pour quand l'endpoint existera)
 */
export interface GetPermissionsResponse {
  message: string;
  data: Permission[];
}
