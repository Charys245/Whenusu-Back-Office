import type { Category } from "./category";
import type { Region } from "./region";
import type { Language } from "./language";
import type { Informateur } from "./informateur";

// ============================================
// INTERFACES TRADITION
// ============================================

export type TraditionStatus = "pending" | "validate" | "rejected" | "archived";

export interface Tradition {
  id: string;
  title: string;
  slug: string;
  transcription: string;
  coverImg?: string;
  mediaUrl?: string;
  status: TraditionStatus;
  favorisCount: number;
  userId: string;
  categoryId: string;
  regionId: string;
  languageId: string;
  informantId: string;
  createdAt?: string;
  updatedAt?: string;
  // Relations (préchargées)
  category?: Category;
  region?: Region;
  language?: Language;
  informant?: Informateur;
}

// ============================================
// PAYLOADS
// ============================================

export interface CreateTraditionPayload {
  title: string;
  transcription: string;
  language_id: string;
  region_id: string;
  category_id: string;
  informant_id: string;
  cover_img: File;
  media_url: File;
}

export interface UpdateTraditionPayload {
  title?: string;
  transcription?: string;
  language_id?: string;
  region_id?: string;
  category_id?: string;
  informant_id?: string;
  cover_img?: File;
  media_url?: File;
}

export interface TraditionsFilterParams {
  page?: number;
  title?: string;
  category_id?: string;
  region_id?: string;
  language_id?: string;
  status?: TraditionStatus;
}

// ============================================
// RESPONSES
// ============================================

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
}

export interface GetTraditionsResponse {
  message: string;
  data: {
    meta: PaginationMeta;
    data: Tradition[];
  };
}

export interface GetTraditionResponse {
  message: string;
  data: Tradition;
}

export interface CreateTraditionResponse {
  message: string;
  data: Tradition;
}

export interface UpdateTraditionResponse {
  message: string;
  data: Tradition;
}

export interface DeleteTraditionResponse {
  message: string;
}

export interface PopularTraditionsResponse {
  message: string;
  data: Tradition[];
}

export interface StatusChangeResponse {
  message: string;
  data: Tradition;
}
