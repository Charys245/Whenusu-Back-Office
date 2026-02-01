import { useState, useEffect } from "react";
import { toast } from "sonner";
import { informateurService } from "@/services/informateurService";
import type {
  Informateur,
  CreateInformateurPayload,
  UpdateInformateurPayload,
} from "@/types/informateur";

// ============================================
// CUSTOM HOOK - useInformateurs
// ============================================

export const useInformateurs = () => {
  const [informateurs, setInformateurs] = useState<Informateur[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer tous les informateurs
  const fetchInformateurs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await informateurService.getAll();
      setInformateurs(data);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des informateurs";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Créer un informateur
  const createInformateur = async (payload: CreateInformateurPayload) => {
    setLoading(true);
    setError(null);
    try {
      const newInformateur = await informateurService.create(payload);
      setInformateurs((prev) => [...prev, newInformateur]);
      toast.success("Informateur créé avec succès !");
      return newInformateur;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Erreur lors de la création";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Modifier un informateur
  const updateInformateur = async (
    id: string,
    payload: UpdateInformateurPayload
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedInformateur = await informateurService.update(id, payload);
      setInformateurs((prev) =>
        prev.map((informateur) =>
          informateur.id === id ? updatedInformateur : informateur
        )
      );
      toast.success("Informateur modifié avec succès !");
      return updatedInformateur;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Erreur lors de la modification";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un informateur
  const deleteInformateur = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await informateurService.delete(id);
      setInformateurs((prev) =>
        prev.filter((informateur) => informateur.id !== id)
      );
      toast.success("Informateur supprimé avec succès !");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Erreur lors de la suppression";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger automatiquement au montage du composant
  useEffect(() => {
    fetchInformateurs();
  }, []);

  return {
    informateurs,
    loading,
    error,
    fetchInformateurs,
    createInformateur,
    updateInformateur,
    deleteInformateur,
  };
};
