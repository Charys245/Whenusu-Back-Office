// ============================================
// INTERFACES LANGUAGE
// ============================================

export interface Language {
  id: string;
  name: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// PAYLOADS (Données envoyées à l'API)
// ============================================

export interface CreateLanguagePayload {
  name: string;
}

export interface UpdateLanguagePayload {
  name?: string;
  slug?: string;
}

// ============================================
// RESPONSES (Données reçues de l'API)
// ============================================

// Pour POST /api/languages (création)
export interface CreateLanguageResponse {
  message: string;
  data: Language;
}

// Pour GET /api/languages (liste)
export interface GetLanguagesResponse {
  message: string;
  languages: Language[];
}

// Pour PUT /api/languages/:id (modification)
export interface UpdateLanguageResponse {
  message: string;
  data: Language;
}

// Pour DELETE /api/languages/:id (suppression)
export interface DeleteLanguageResponse {
  message: string;
}
