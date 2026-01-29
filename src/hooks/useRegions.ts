import { useState, useEffect } from "react";
import { toast } from "sonner";
import { regionService } from "@/services/regionService";
import type {
  Region,
  CreateRegionPayload,
  UpdateRegionPayload,
  // AssignLanguagesPayload,
  // UnassignLanguagesPayload,
} from "@/types/region";

// ============================================
// CUSTOM HOOK - useRegions
// ============================================

export const useRegions = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer toutes les régions
  const fetchRegions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await regionService.getAll();
      setRegions(data);
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors du chargement des régions";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Créer une région
  const createRegion = async (payload: CreateRegionPayload) => {
    setLoading(true);
    setError(null);
    try {
      const newRegion = await regionService.create(payload);
      setRegions((prev) => [...prev, newRegion]);
      toast.success("Région créée avec succès !");
      return newRegion;
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors de la création";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Modifier une région
  const updateRegion = async (id: string, payload: UpdateRegionPayload) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRegion = await regionService.update(id, payload);
      setRegions((prev) =>
        prev.map((region) => (region.id === id ? updatedRegion : region))
      );
      toast.success("Région modifiée avec succès !");
      return updatedRegion;
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors de la modification";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une région
  const deleteRegion = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await regionService.delete(id);
      setRegions((prev) => prev.filter((region) => region.id !== id));
      toast.success("Région supprimée avec succès !");
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors de la suppression";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Assigner des langues
  // const assignLanguages = async (
  //   id: string,
  //   payload: AssignLanguagesPayload
  // ) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const updatedRegion = await regionService.assignLanguages(id, payload);
  //     setRegions((prev) =>
  //       prev.map((region) => (region.id === id ? updatedRegion : region))
  //     );
  //     toast.success("Langues assignées avec succès !");
  //     return updatedRegion;
  //   } catch (err: any) {
  //     const errorMsg = err.message || "Erreur lors de l'assignation";
  //     setError(errorMsg);
  //     toast.error(errorMsg);
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Détacher des langues
  // const unassignLanguages = async (
  //   id: string,
  //   payload: UnassignLanguagesPayload
  // ) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const updatedRegion = await regionService.unassignLanguages(id, payload);
  //     setRegions((prev) =>
  //       prev.map((region) => (region.id === id ? updatedRegion : region))
  //     );
  //     toast.success("Langues détachées avec succès !");
  //     return updatedRegion;
  //   } catch (err: any) {
  //     const errorMsg = err.message || "Erreur lors du détachement";
  //     setError(errorMsg);
  //     toast.error(errorMsg);
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Charger automatiquement au montage du composant
  useEffect(() => {
    fetchRegions();
  }, []);

  return {
    regions,
    loading,
    error,
    fetchRegions,
    createRegion,
    updateRegion,
    deleteRegion,
    // assignLanguages,
    // unassignLanguages,
  };
};

// ============================================
// CUSTOM HOOK - useRegion (pour une seule région)
// ============================================

// export const useRegion = (id: string) => {
//   const [region, setRegion] = useState<Region | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // const fetchRegion = async () => {
//   //   if (!id) return;

//   //   setLoading(true);
//   //   setError(null);
//   //   try {
//   //     const data = await regionService.getById(id);
//   //     setRegion(data);
//   //   } catch (err: any) {
//   //     const errorMsg = err.message || "Erreur lors du chargement";
//   //     setError(errorMsg);
//   //     toast.error(errorMsg);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchRegion();
//   // }, [id]);

//   return {
//     region,
//     loading,
//     error,
//     // refetch: fetchRegion,
//   };
// };
