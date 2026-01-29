import { httpClient } from "./http";
import { z } from "zod";
import type {
  LoginResponse,
  LoginWithEmailPayload,
  LoginWithPhonePayload,
  RegisterPayload,
  RegisterResponse,
} from "@/types/auth";

// Schéma pour l'inscription
const registerSchema = z.object({
  last_name: z.string().min(1, "Le nom est requis"),
  first_name: z.string().min(1, "Le prénom est requis"),
  phone_number: z.string().min(1, "Le numéro de téléphone est requis"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
});

// ============================================
// SCHÉMAS DE VALIDATION ZOD
// ============================================
const loginWithEmailSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(3, "Le mot de passe doit contenir au moins 3 caractères"),
});

const loginWithPhoneSchema = z.object({
  phone_number: z
    .string()
    .min(1, "Le numéro de téléphone est requis")
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Format de numéro de téléphone invalide (ex: +229XXXXXXXX)"
    ),
  password: z
    .string()
    .min(3, "Le mot de passe doit contenir au moins 3 caractères"),
});

// ============================================
// TYPES
// ============================================
type LoginCredentials = LoginWithEmailPayload | LoginWithPhonePayload;

interface ApiErrorResponse {
  message?: string;
  status?: number;
  data?: any;
  response?: {
    data?: {
      message?: string;
    };
  };
}

// ============================================
// SERVICE D'AUTHENTIFICATION
// ============================================
export const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   * @param payload - Données d'inscription (multipart/form-data)
   * @returns RegisterResponse avec message et données utilisateur
   */
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    try {
      // 1. Validation des données d'entrée avec Zod
      registerSchema.parse(payload);

      // 2. Création du FormData pour multipart/form-data
      const formData = new FormData();
      formData.append("last_name", payload.last_name);
      formData.append("first_name", payload.first_name);
      formData.append("phone_number", payload.phone_number);
      formData.append("password", payload.password);

      // Champs optionnels
      if (payload.email) {
        formData.append("email", payload.email);
      }
      if (payload.region_id) {
        formData.append("region_id", payload.region_id);
      }
      if (payload.avatar_url) {
        formData.append("avatar_url", payload.avatar_url);
      }

      // 3. Appel API
      const response = await httpClient.post<RegisterResponse>(
        "/auth/register/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 4. Retour des données
      return response.data;
    } catch (error) {
      // Gestion des erreurs Zod
      // if (error instanceof z.ZodError) {
      //   // const firstError = error.errors[0];
      //   throw new Error(firstError.message);
      // }

      if (error instanceof z.ZodError) {
        // const firstError = error.errors[0];
        throw new Error(error.message);
      }

      // Gestion des erreurs API
      const apiError = error as ApiErrorResponse;
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.message ||
        "Une erreur est survenue lors de l'inscription";

      console.error("Erreur d'inscription:", {
        message: errorMessage,
        status: apiError.status,
        data: apiError.data,
      });

      throw new Error(errorMessage);
    }
  },

  /**
   * Connexion avec email ou téléphone
   * @param credentials - Email + password OU phone_number + password
   * @returns LoginResponse avec user, token et permissions
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // 1. Validation des données d'entrée avec Zod
      if ("email" in credentials && credentials.email) {
        loginWithEmailSchema.parse(credentials);
      } else if ("phone_number" in credentials && credentials.phone_number) {
        loginWithPhoneSchema.parse(credentials);
      } else {
        throw new Error("Email ou numéro de téléphone requis");
      }

      // 2. Appel API
      const response = await httpClient.post<LoginResponse>(
        "/auth/login/",
        credentials
      );

      // 3. Validation de la réponse API
      const validatedData = response.data;

      // 4. Retour des données validées
      return validatedData;
    } catch (error) {
      // Gestion des erreurs Zod
      if (error instanceof z.ZodError) {
        // const firstError = error.errors[0];
        throw new Error(error.message);
      }

      // Gestion des erreurs API
      const apiError = error as ApiErrorResponse;
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.message ||
        "Une erreur est survenue lors de la connexion";

      console.error("Erreur de connexion:", {
        message: errorMessage,
        status: apiError.status,
        data: apiError.data,
      });

      throw new Error(errorMessage);
    }
  },

  /**
   * Déconnexion
   * Note: Ajoute ici la logique de déconnexion côté serveur si nécessaire
   */
  logout: async (): Promise<void> => {
    try {
      // Si ton API a un endpoint de logout
      await httpClient.delete("/auth/logout");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // On ne bloque pas la déconnexion côté client même si l'API échoue
    }
  },

  /**
   * Rafraîchissement du token
   * Note: À implémenter selon ton API
   */
  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    try {
      const response = await httpClient.post<{ token: string }>(
        "/auth/refresh/",
        { refresh_token: refreshToken }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token:", error);
      throw error;
    }
  },
};

// Export des schémas pour réutilisation si nécessaire
export { loginWithEmailSchema, loginWithPhoneSchema };
