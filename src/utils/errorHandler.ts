import { z } from "zod";

// Traductions des messages d'erreur Zod
const errorTranslations: Record<string, string> = {
  Required: "Champ requis",
  Invalid: "Invalide",
  "Too big": "Valeur trop grande",
  "Too small": "Valeur trop petite",
  "Invalid type": "Type invalide",
  "Expected number": "Nombre attendu",
  "Expected string": "Texte attendu",
};

// Traductions des noms de champs
const fieldTranslations: Record<string, string> = {
  longitude: "Longitude",
  latitude: "Latitude",
  name: "Nom",
  location: "Localisation",
  slug: "Identifiant",
  email: "Email",
  password: "Mot de passe",
  phone: "Téléphone",
  address: "Adresse",
  
  // Ajouter d'autres champs au fur et à mesure
};

// Messages d'erreur spécifiques
const specificErrorMessages: Record<
  string,
  (field: string, message: string) => string | null
> = {
  longitude: (field, message) => {
    if (message.includes("<=180") || message.includes(">=-180")) {
      return "La longitude doit être entre -180 et 180";
    }
    return null;
  },
  latitude: (field, message) => {
    if (message.includes("<=90") || message.includes(">=-90")) {
      return "La latitude doit être entre -90 et 90";
    }
    return null;
  },
};

/**
 * Formate les erreurs Zod en messages lisibles en français
 */
export const formatZodError = (error: z.ZodError): string => {
  const errorMessages = error.issues.map((err: z.ZodIssue) => {
    const field = err.path.join(".");
    let message = err.message;

    // Vérifier si un message spécifique existe pour ce champ
    const specificMessage = specificErrorMessages[field]?.(field, message);
    if (specificMessage) {
      return specificMessage;
    }

    // Traduction des messages génériques
    Object.entries(errorTranslations).forEach(([en, fr]) => {
      message = message.replace(new RegExp(en, "gi"), fr);
    });

    // Traduction du nom du champ
    const translatedField = fieldTranslations[field] || field;

    return `${translatedField}: ${message}`;
  });

  return errorMessages.join(", ");
};

/**
 * Gestion centralisée des erreurs API
 */
interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: any;
    };
  };
  message?: string;
}

export const handleApiError = (
  error: unknown,
  defaultMessage: string = "Une erreur est survenue"
): string => {
  // Erreur de validation Zod
  if (error instanceof z.ZodError) {
    return formatZodError(error);
  }

  // Erreur API
  const apiError = error as ApiErrorResponse;
  return apiError.response?.data?.message || apiError.message || defaultMessage;
};
