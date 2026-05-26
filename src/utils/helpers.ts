import type { User } from "@/types/User";

/**
 * Retourne l'URL complète d'un fichier media retourné par le backend.
 * Construit l'URL en utilisant la base du serveur API.
 * Gère aussi le cas où le backend retourne une URL complète avec un ancien domaine.
 */
export const getMediaUrl = (path?: string): string | undefined => {
  if (!path) return undefined;

  // Récupérer l'URL de base de l'API et extraire l'URL du serveur
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3333/api";
  // Enlever le "/api" à la fin pour avoir l'URL du serveur
  const serverUrl = apiBaseUrl.replace(/\/api\/?$/, "");

  // Si c'est déjà une URL complète
  if (path.startsWith("http://") || path.startsWith("https://")) {
    // Extraire le chemin relatif et reconstruire avec le bon serveur
    // Pattern: http(s)://domain.com/uploads/...
    const match = path.match(/^https?:\/\/[^/]+(\/uploads\/.*)$/);
    if (match) {
      return `${serverUrl}${match[1]}`;
    }
    // Si pas de match, retourner tel quel
    return path;
  }

  // S'assurer que le chemin commence par /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${serverUrl}${normalizedPath}`;
};

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
