import type { User } from "@/types/User";

/**
 * Helpers pour accéder aux propriétés utilisateur
 * Gère les deux formats: snake_case et camelCase
 */

export const getUserFirstName = (user: User): string => {
  return user.first_name || user.firstName || "";
};

export const getUserLastName = (user: User): string => {
  return user.last_name || user.lastName || "";
};

export const getUserFullName = (user: User): string => {
  const firstName = getUserFirstName(user);
  const lastName = getUserLastName(user);
  return `${firstName} ${lastName}`.trim();
};

export const getUserInitials = (user: User): string => {
  const firstName = getUserFirstName(user);
  const lastName = getUserLastName(user);
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

export const getUserPhoneNumber = (user: User): string | null => {
  return user.phone_number || user.phoneNumber || null;
};

export const getUserAvatarUrl = (user: User): string | null => {
  return user.avatar_url || user.avatarUrl || null;
};

export const getUserRegionId = (user: User): string | null => {
  return user.region_id || user.regionId || null;
};

export const getUserSendNotif = (user: User): boolean => {
  return user.send_notif ?? user.sendNotif ?? false;
};

export const getUserCreatedAt = (user: User): string | null => {
  return user.created_at || user.createdAt || null;
};

export const getUserUpdatedAt = (user: User): string | null => {
  return user.updated_at || user.updatedAt || null;
};
