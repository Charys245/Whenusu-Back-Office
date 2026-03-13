import type { Language } from "./language";

// ============================================
// INTERFACES REGION
// ============================================

export interface Region {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  location?: string;
  longitude?: number;
  latitude?: number;
  languages?: Language[];
  created_at?: string;
  updated_at?: string;
}

// Pour GET /api/regions (liste)
export interface GetRegionsResponse {
  message: string;
  regions: Region[];
}

// Pour POST /api/regions (création)
export interface CreateRegionResponse {
  message: string;
  data: Region;
}

// Pour PUT /api/regions/:id (modification)
export interface UpdateRegionResponse {
  message: string;
  region: Region;
}

// Pour DELETE /api/regions/:id (suppression)
export interface DeleteRegionResponse {
  message: string;
}

// ============================================
// PAYLOADS (Données envoyées à l'API)
// ============================================

export interface CreateRegionPayload {
  name: string;
  description?: string;
  slug?: string;
  location?: string;
  longitude?: number;
  latitude?: number;
}

export interface UpdateRegionPayload {
  name?: string;
  description?: string;
  slug?: string;
  location?: string;
  longitude?: number;
  latitude?: number;
}

export interface AssignLanguagesPayload {
  languages: string[]; // Tableau d'IDs des langues
}

export interface UnassignLanguagesPayload {
  languages: string[]; // Tableau d'IDs des langues
}

// ============================================
// RESPONSES (Données reçues de l'API)
// ============================================

// Interface pour assign/unassign languages
export interface AssignLanguagesResponse {
  message: string;
  region: Region;
}

export interface UnassignLanguagesResponse {
  message: string;
  region: Region;
}
