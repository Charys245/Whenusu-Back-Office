// ============================================
// INTERFACES INFORMATEUR
// ============================================

export interface Informateur {
  id: string;
  name: string;
  phoneNumber: string;
  avatarUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// PAYLOADS (Données envoyées à l'API)
// ============================================

export interface CreateInformateurPayload {
  name: string;
  phoneNumber: string;
  avatar_url?: File;
}

export interface UpdateInformateurPayload {
  name?: string;
  phoneNumber?: string;
  avatar_url?: File;
}

// ============================================
// RESPONSES (Données reçues de l'API)
// ============================================

// Pour POST /api/informants (création)
export interface CreateInformateurResponse {
  message: string;
  data: Informateur;
}

// Pour GET /api/informants (liste)
export interface GetInformateursResponse {
  message: string;
  data: Informateur[];
}

// Pour PUT /api/informants/:id (modification)
export interface UpdateInformateurResponse {
  message: string;
  data: Informateur;
}

// Pour DELETE /api/informants/:id (suppression)
export interface DeleteInformateurResponse {
  message: string;
}
