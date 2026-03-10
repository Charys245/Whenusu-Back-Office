// types/User.ts

import type { Role } from "./Role";

/**
 * Interface principale pour un utilisateur WHENUSU
 * Supporte les deux formats: snake_case et camelCase
 */
export interface User {
  id: string;
  // snake_case (ancien format)
  last_name?: string;
  first_name?: string;
  phone_number?: string;
  avatar_url?: string | null;
  apple_id?: string | null;
  google_id?: string | null;
  otp_code?: string | null;
  region_id?: string | null;
  send_notif?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  // camelCase (nouveau format API)
  lastName?: string;
  firstName?: string;
  phoneNumber?: string;
  avatarUrl?: string | null;
  appleId?: string | null;
  googleId?: string | null;
  otpCode?: string | null;
  regionId?: string | null;
  sendNotif?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Communs
  email?: string | null;
  provider?: string | null; // "google" | "apple" | "local"
  role?: string; // Ancien champ unique (rétrocompatibilité)
  roles?: Role[]; // Nouveau champ (tableau de rôles)
}

/**
 * Type pour la création d'un utilisateur
 */
export interface CreateUserPayload {
  last_name: string;
  first_name: string;
  email: string;
  phone_number: string;
  password: string;
  region_id: string;
  send_notif?: boolean;
}

/**
 * Type pour la mise à jour d'un utilisateur
 */
export interface UpdateUserPayload {
  last_name?: string;
  first_name?: string;
  email?: string;
  phone_number?: string;
  avatar_url?: string | null;
  region_id?: string;
  send_notif?: boolean;
}

/**
 * Type pour la réponse de connexion
 */
export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

// ============================================
// PAGINATION & STATISTICS (GET /api/users)
// ============================================

/**
 * Métadonnées de pagination
 */
export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
}

/**
 * Statistiques des utilisateurs
 */
export interface UsersStatistics {
  totalUsers: number;
  totalMonthUser: number;
}

/**
 * Données paginées des utilisateurs
 */
export interface PaginatedUsers {
  meta: PaginationMeta;
  data: User[];
}

/**
 * Réponse complète GET /api/users
 */
export interface GetUsersResponse {
  message: string;
  statistics: UsersStatistics;
  data: PaginatedUsers;
}

/**
 * Réponse toggle notification POST /api/users
 */
export interface ToggleNotificationResponse {
  message: string;
}
