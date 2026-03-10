import { httpClient } from "./http";
import { handleApiError } from "@/utils/errorHandler";
import type {
  LoginResponse,
  LoginWithEmailPayload,
  LoginWithPhonePayload,
  RegisterPayload,
  RegisterResponse,
  GetUserProfileResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
  UpdatePasswordPayload,
  UpdatePasswordResponse,
  DeleteAccountResponse,
  VerifyUserPayload,
  VerifyUserResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
} from "@/types/auth";

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
      // Création du FormData pour multipart/form-data (requis par le backend)
      const formData = new FormData();
      // Utiliser snake_case pour les noms de champs (comme attendu par le backend)
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

      // Appel API
      const response = await httpClient.post<RegisterResponse>(
        "/auth/register/",
        formData
      );

      return response.data;
    } catch (error) {
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
      // Utiliser FormData pour multipart/form-data (requis par le backend pour retourner les rôles)
      const formData = new FormData();

      if ("email" in credentials) {
        formData.append("email", credentials.email);
      } else {
        formData.append("phoneNumber", credentials.phone_number);
      }
      formData.append("password", credentials.password);

      const response = await httpClient.post<LoginResponse>(
        "/auth/login/",
        formData
      );

      return response.data;
    } catch (error) {
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

  // ============================================
  // USER PROFILE
  // ============================================

  /**
   * GET /api/auth/user
   * Récupère le profil de l'utilisateur connecté
   */
  getUserProfile: async (): Promise<GetUserProfileResponse> => {
    try {
      const response =
        await httpClient.get<GetUserProfileResponse>("/auth/user");
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la récupération du profil"
      );
      console.error("Erreur getUserProfile:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/auth/update-profile
   * Modifie le profil de l'utilisateur connecté
   * L'API attend multipart/form-data
   */
  updateProfile: async (
    payload: UpdateProfilePayload
  ): Promise<UpdateProfileResponse> => {
    try {
      const formData = new FormData();

      // Ajouter uniquement les champs non vides
      if (payload.last_name?.trim()) {
        formData.append("last_name", payload.last_name.trim());
      }
      if (payload.first_name?.trim()) {
        formData.append("first_name", payload.first_name.trim());
      }
      if (payload.email?.trim()) {
        formData.append("email", payload.email.trim());
      }
      if (payload.phone_number?.trim()) {
        formData.append("phone_number", payload.phone_number.trim());
      }
      if (payload.region_id?.trim()) {
        formData.append("region_id", payload.region_id.trim());
      }
      if (payload.avatar_url instanceof File) {
        formData.append("avatar_url", payload.avatar_url);
      }
      if (payload.send_notif !== undefined) {
        formData.append("send_notif", String(payload.send_notif));
      }

      const response = await httpClient.post<UpdateProfileResponse>(
        "/auth/update-profile",
        formData
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la modification du profil"
      );
      console.error("Erreur updateProfile:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // ============================================
  // PASSWORD
  // ============================================

  /**
   * POST /api/auth/update-password
   * Change le mot de passe de l'utilisateur connecté
   */
  updatePassword: async (
    payload: UpdatePasswordPayload
  ): Promise<UpdatePasswordResponse> => {
    try {
      const response = await httpClient.post<UpdatePasswordResponse>(
        "/auth/update-password",
        payload
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors du changement de mot de passe"
      );
      console.error("Erreur updatePassword:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // ============================================
  // DELETE ACCOUNT
  // ============================================

  /**
   * POST /api/auth/delete-account
   * Supprime le compte de l'utilisateur connecté
   */
  deleteAccount: async (): Promise<DeleteAccountResponse> => {
    try {
      const response = await httpClient.post<DeleteAccountResponse>(
        "/auth/delete-account"
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la suppression du compte"
      );
      console.error("Erreur deleteAccount:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // ============================================
  // PASSWORD RECOVERY (3 steps)
  // ============================================

  /**
   * POST /api/auth/verify-user
   * Étape 1: Vérifie que l'utilisateur existe et envoie un code OTP
   */
  verifyUser: async (payload: VerifyUserPayload): Promise<VerifyUserResponse> => {
    try {
      const response = await httpClient.post<VerifyUserResponse>(
        "/auth/verify-user",
        payload
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la vérification de l'utilisateur"
      );
      console.error("Erreur verifyUser:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/auth/verify-otp-code
   * Étape 2: Vérifie le code OTP envoyé par email
   */
  verifyOtpCode: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    try {
      const response = await httpClient.post<VerifyOtpResponse>(
        "/auth/verify-otp-code",
        payload
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la vérification du code OTP"
      );
      console.error("Erreur verifyOtpCode:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * POST /api/auth/forgot-password
   * Étape 3: Réinitialise le mot de passe avec le userId obtenu à l'étape 2
   */
  forgotPassword: async (
    payload: ForgotPasswordPayload
  ): Promise<ForgotPasswordResponse> => {
    try {
      const response = await httpClient.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        payload
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la réinitialisation du mot de passe"
      );
      console.error("Erreur forgotPassword:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};

