// @/components/regions/ViewRegionModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import type { Region } from "@/types/region";
import { formatDateTime } from "@/utils/dateUtils";

interface ViewRegionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  region: Region | null;
}

export const ViewRegionModal = ({
  open,
  onOpenChange,
  region,
}: ViewRegionModalProps) => {
  if (!region) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de la région</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nom</p>
              <p className="text-base font-semibold">{region.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Slug</p>
              <p className="text-base">{region.slug}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Localisation
            </p>
            <p className="text-base">{region.location}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Longitude
              </p>
              <p className="text-base">{region.longitude}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Latitude
              </p>
              <p className="text-base">{region.latitude}</p>
            </div>
          </div>

          {region.created_at && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Date de création
              </p>
              <p className="text-base">{formatDateTime(region.created_at)}</p>
            </div>
          )}

          {region.updated_at && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Dernière modification
              </p>
              <p className="text-base">{formatDateTime(region.updated_at)}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Langues associées
            </p>
            {region.languages && region.languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {region.languages.map((language) => (
                  <Badge key={language.id} variant="secondary">
                    {language.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Aucune langue associée
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
