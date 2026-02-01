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
import type { Category, UpdateCategoryPayload } from "@/types/category";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSubmit: (id: string, payload: UpdateCategoryPayload) => Promise<Category>;
  loading: boolean;
}

export const EditCategoryModal = ({
  open,
  onOpenChange,
  category,
  onSubmit,
  loading,
}: EditCategoryModalProps) => {
  const [formData, setFormData] = useState<UpdateCategoryPayload>({
    name: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category?.id) return;

    try {
      await onSubmit(category.id, formData);
      onOpenChange(false);
    } catch {
      // L'erreur est déjà gérée dans le hook avec toast
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la catégorie</DialogTitle>
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
              placeholder="Nom de la catégorie"
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
