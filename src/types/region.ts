// ============================================
// INTERFACES REGION
// ============================================

export interface Region {
  id: string;
  name: string;
  slug: string;
  location: string;
  longitude: number;
  latitude: number;
  createdAt?: string;
  updatedAt?: string;
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
  slug?: string;
  location: string;
  longitude: number;
  latitude: number;
}

export interface UpdateRegionPayload {
  name?: string;
  slug?: string;
  location?: string;
  longitude?: number;
  latitude?: number;
}

export interface AssignLanguagesPayload {
  languages: string[]; // IDs des langues
}

export interface UnassignLanguagesPayload {
  languages: string[]; // IDs des langues
}

// ============================================
// RESPONSES (Données reçues de l'API)
// ============================================

// Interface pour la réponse complète
export interface RegionResponse {
  message: string;
  regions: Region[];
}

// export interface RegionsListResponse extends Array<Region> {}

export interface AssignLanguagesResponse extends Region {}

export interface UnassignLanguagesResponse extends Region {}
