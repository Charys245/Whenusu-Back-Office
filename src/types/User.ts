// types/User.ts

/**
 * Interface principale pour un utilisateur WHENUSU
 */
export interface User {
  id?: string; // Probablement ajouté par l'API mais pas dans l'exemple
  last_name: string;
  first_name: string;
  email: string;
  phone_number: string;
  avatar_url: string | null;
  provider: string | null; // "google" | "apple" | "email"
  apple_id: string | null;
  google_id: string | null;
  otp_code: string | null;
  region_id: string;
  send_notif: boolean;

  // Champs additionnels probables (selon ton backend)
  role?: string; // "admin" | "user" | "moderator"
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
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
