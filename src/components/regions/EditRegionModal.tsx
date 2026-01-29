// @/components/regions/EditRegionModal.tsx
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
import type { Region, UpdateRegionPayload } from "@/types/region";

interface EditRegionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  region: Region | null;
  onSubmit: (id: string, payload: UpdateRegionPayload) => Promise<Region>;
  loading: boolean;
}

export const EditRegionModal = ({
  open,
  onOpenChange,
  region,
  onSubmit,
  loading,
}: EditRegionModalProps) => {
  const [formData, setFormData] = useState<UpdateRegionPayload>({
    name: "",
    location: "",
    longitude: 0,
    latitude: 0,
  });

  useEffect(() => {
    if (region) {
      setFormData({
        name: region.name,
        location: region.location,
        longitude: region.longitude,
        latitude: region.latitude,
      });
    }
  }, [region]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!region?.id) return;

    try {
      await onSubmit(region.id, formData);
      onOpenChange(false);
    } catch (error) {
      // L'erreur est déjà gérée dans le hook avec toast
    }
  };

  if (!region) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la région</DialogTitle>
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
              placeholder="Nom de la région"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-location">Localisation *</Label>
            <Input
              id="edit-location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Localisation"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-longitude">Longitude *</Label>
              <Input
                id="edit-longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: parseFloat(e.target.value),
                  })
                }
                placeholder="0.0"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-latitude">Latitude *</Label>
              <Input
                id="edit-latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: parseFloat(e.target.value),
                  })
                }
                placeholder="0.0"
                required
                disabled={loading}
              />
            </div>
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
