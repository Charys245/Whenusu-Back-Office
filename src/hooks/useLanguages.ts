import { useState, useEffect } from "react";
import { toast } from "sonner";
import { languageService } from "@/services/languageService";
import type {
  Language,
  CreateLanguagePayload,
  UpdateLanguagePayload,
} from "@/types/language";

// ============================================
// CUSTOM HOOK - useLanguages
// ============================================

export const useLanguages = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer toutes les langues
  const fetchLanguages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await languageService.getAll();
      setLanguages(data);
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors du chargement des langues";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Créer une langue
  const createLanguage = async (payload: CreateLanguagePayload) => {
    setLoading(true);
    setError(null);
    try {
      const newLanguage = await languageService.create(payload);
      setLanguages((prev) => [...prev, newLanguage]);
      toast.success("Langue créée avec succès !");
      return newLanguage;
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors de la création";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Modifier une langue
  const updateLanguage = async (id: string, payload: UpdateLanguagePayload) => {
    setLoading(true);
    setError(null);
    try {
      const updatedLanguage = await languageService.update(id, payload);
      setLanguages((prev) =>
        prev.map((language) =>
          language.id === id ? updatedLanguage : language
        )
      );
      toast.success("Langue modifiée avec succès !");
      return updatedLanguage;
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors de la modification";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une langue
  const deleteLanguage = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await languageService.delete(id);
      setLanguages((prev) => prev.filter((language) => language.id !== id));
      toast.success("Langue supprimée avec succès !");
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors de la suppression";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger automatiquement au montage du composant
  useEffect(() => {
    fetchLanguages();
  }, []);

  return {
    languages,
    loading,
    error,
    fetchLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
  };
};
