import type { User } from "@/types/User";

/**
 * Helper pour obtenir le nom complet
 */
export const getFullName = (user: User): string => {
  return `${user.first_name} ${user.last_name}`.trim();
};

/**
 * Helper pour obtenir les initiales
 */
export const getInitials = (user: User): string => {
  const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || "";
  const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || "";
  return `${firstInitial}${lastInitial}`;
};

/**
 * Helper pour vérifier si l'utilisateur est connecté via OAuth
 */
export const isOAuthUser = (user: User): boolean => {
  return !!(user.google_id || user.apple_id);
};
