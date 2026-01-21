import { useTokenStore } from "@/store/authStore";
import type { ApiError, ApiResponse } from "@/types/http-type";
import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useTokenStore.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  if (config.data instanceof FormData) delete config.headers["Content-Type"];
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const isAuthEndpoint = originalRequest.url?.includes("/auth/");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers!.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await apiClient.post("/auth/refresh-token/");
        const { access_token, refresh_token } = data.data || data;

        useTokenStore.getState().setTokens(access_token, refresh_token);
        originalRequest.headers!.Authorization = `Bearer ${access_token}`;

        onRefreshed(access_token);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch {
        isRefreshing = false;
        useTokenStore.getState().clearTokens();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Fonction utilitaire pour gérer les erreurs
const handleError = (error: AxiosError): ApiError => {
  if (error.response) {
    return {
      message:
        (error.response.data as any)?.message || "Une erreur est survenue",
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    return {
      message: "Erreur de réseau - Pas de réponse du serveur",
      status: 0,
    };
  } else {
    return {
      message: error.message || "Une erreur inattendue est survenue",
      status: 0,
    };
  }
};

// Fonctions HTTP principales
export const httpClient = {
  // GET Request
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<T>(url, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  // POST Request
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<T>(url, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  // PUT Request
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<T>(url, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  // PATCH Request
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.patch<T>(url, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  // DELETE Request
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.delete<T>(url, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },
};
