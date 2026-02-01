// ============================================
// INTERFACES CATEGORY
// ============================================

export interface Category {
  id: string;
  name: string;
  slug?: string;
  createdBy?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// PAYLOADS (Données envoyées à l'API)
// ============================================

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name?: string;
}

// ============================================
// RESPONSES (Données reçues de l'API)
// ============================================

// Pour POST /api/categories (création)
export interface CreateCategoryResponse {
  message: string;
  data: Category;
}

// Pour GET /api/categories (liste)
export interface GetCategoriesResponse {
  message: string;
  data: Category[];
}

// Pour PUT /api/categories/:id (modification)
export interface UpdateCategoryResponse {
  message: string;
  data: Category;
}

// Pour DELETE /api/categories/:id (suppression)
export interface DeleteCategoryResponse {
  message: string;
}
