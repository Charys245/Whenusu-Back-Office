import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X, Globe } from "lucide-react";
import { useRegions } from "@/hooks/useRegions";
import { useLanguages } from "@/hooks/useLanguages";
import type { Region } from "@/types/region";
import type { Language } from "@/types/language";

interface ManageRegionLanguagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  region: Region | null;
}

export const ManageRegionLanguagesModal = ({
  open,
  onOpenChange,
  region,
}: ManageRegionLanguagesModalProps) => {
  const { assignLanguages, unassignLanguages } = useRegions();
  const { languages, loading: languagesLoading } = useLanguages();

  const [assigningLanguageId, setAssigningLanguageId] = useState<string | null>(null);
  const [unassigningLanguageId, setUnassigningLanguageId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // State local pour suivre les langues assignées
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());

  // Réinitialiser quand on ouvre le modal avec une nouvelle région
  useEffect(() => {
    if (open && region) {
      const initialIds = new Set((region.languages || []).map((l) => l.id));
      setAssignedIds(initialIds);
    }
  }, [open, region?.id]);

  if (!region) return null;

  // Langues assignées (objets complets pour l'affichage)
  const assignedLanguages = languages.filter((l) => assignedIds.has(l.id));
  const hasLanguages = assignedLanguages.length > 0;

  // Langues disponibles (non assignées)
  const availableLanguages = languages.filter((l) => !assignedIds.has(l.id));

  // Assigner une langue
  const handleAssignLanguage = async (language: Language) => {
    if (assignedIds.has(language.id) || isProcessing) return;

    setIsProcessing(true);
    setAssigningLanguageId(language.id);
    try {
      await assignLanguages(region.id, language.id);
      // Ajouter au state local
      setAssignedIds((prev) => new Set(prev).add(language.id));
    } catch {
      // Error handled by hook
    } finally {
      setAssigningLanguageId(null);
      setIsProcessing(false);
    }
  };

  // Détacher une langue
  const handleUnassignLanguage = async (languageId: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setUnassigningLanguageId(languageId);
    try {
      await unassignLanguages(region.id, languageId);
      // Retirer du state local
      setAssignedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(languageId);
        return newSet;
      });
    } catch {
      // Error handled by hook
    } finally {
      setUnassigningLanguageId(null);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Gérer les langues
          </DialogTitle>
          <DialogDescription>
            {region.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Langues actuelles de la région */}
          <div>
            <Label className="text-sm font-medium">Langues associées</Label>
            {hasLanguages ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {assignedLanguages.map((language) => (
                  <Badge
                    key={language.id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {language.name}
                    <button
                      onClick={() => handleUnassignLanguage(language.id)}
                      disabled={unassigningLanguageId === language.id}
                      className="ml-1 hover:bg-destructive/20 rounded p-0.5"
                    >
                      {unassigningLanguageId === language.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                Aucune langue associée
              </p>
            )}
          </div>

          {/* Langues disponibles */}
          <div>
            <Label className="text-sm font-medium">Langues disponibles</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {languagesLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chargement des langues...
                </div>
              ) : availableLanguages.length > 0 ? (
                availableLanguages.map((language) => (
                  <Badge
                    key={language.id}
                    variant="outline"
                    className={`cursor-pointer hover:bg-primary/10 ${
                      isProcessing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() =>
                      !isProcessing && handleAssignLanguage(language)
                    }
                  >
                    {assigningLanguageId === language.id ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3 mr-1" />
                    )}
                    {language.name}
                  </Badge>
                ))
              ) : languages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune langue disponible
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Toutes les langues sont déjà associées
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
