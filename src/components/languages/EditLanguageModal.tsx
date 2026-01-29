import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Language, UpdateLanguagePayload } from "@/types/language";

interface EditLanguageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language | null;
  onSubmit: (id: string, payload: UpdateLanguagePayload) => Promise<Language>;
  loading: boolean;
}

export const EditLanguageModal = ({
  open,
  onOpenChange,
  language,
  onSubmit,
  loading,
}: EditLanguageModalProps) => {
  const [formData, setFormData] = useState<UpdateLanguagePayload>({
    name: "",
  });

  useEffect(() => {
    if (language) {
      setFormData({
        name: language.name,
      });
    }
  }, [language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!language?.id) return;

    try {
      await onSubmit(language.id, formData);
      onOpenChange(false);
    } catch (error) {
      // L'erreur est déjà gérée dans le hook avec toast
    }
  };

  if (!language) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la langue</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nom *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nom de la langue"
              required
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
