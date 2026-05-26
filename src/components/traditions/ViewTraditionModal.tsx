import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Tradition, TraditionStatus } from "@/types/tradition";
import { formatDateTime } from "@/utils/dateUtils";
import { getMediaUrl } from "@/utils/helpers";

interface ViewTraditionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tradition: Tradition | null;
}

const statusConfig: Record<TraditionStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "En attente", variant: "secondary" },
  validate: { label: "Validée", variant: "default" },
  rejected: { label: "Rejetée", variant: "destructive" },
  archived: { label: "Archivée", variant: "outline" },
};

export const ViewTraditionModal = ({
  open,
  onOpenChange,
  tradition,
}: ViewTraditionModalProps) => {
  if (!tradition) return null;

  const status = statusConfig[tradition.status];
  const coverUrl = getMediaUrl(tradition.coverImg);
  const mediaUrl = getMediaUrl(tradition.mediaUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {tradition.title}
            <Badge variant={status.variant}>{status.label}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image de couverture */}
          {coverUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={coverUrl}
                alt={tradition.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Média audio */}
          {mediaUrl && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Audio
              </p>
              <audio
                src={mediaUrl}
                controls
                className="w-full"
              />
            </div>
          )}

          <Separator />

          {/* Transcription */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Transcription
            </p>
            <p className="text-sm whitespace-pre-wrap">{tradition.transcription}</p>
          </div>

          <Separator />

          {/* Relations */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
              <p className="text-base">{tradition.category?.name || tradition.categoryId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Région</p>
              <p className="text-base">{tradition.region?.name || tradition.regionId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Langue</p>
              <p className="text-base">{tradition.language?.name || tradition.languageId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Informateur</p>
              <p className="text-base">{tradition.informant?.name || tradition.informantId}</p>
            </div>
          </div>

          <Separator />

          {/* Métadonnées */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Favoris</p>
              <p className="font-medium">{tradition.favorisCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Slug</p>
              <p className="font-medium font-mono text-xs">{tradition.slug}</p>
            </div>
            {tradition.createdAt && (
              <div>
                <p className="text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(tradition.createdAt)}</p>
              </div>
            )}
            {tradition.updatedAt && (
              <div>
                <p className="text-muted-foreground">Dernière modification</p>
                <p className="font-medium">{formatDateTime(tradition.updatedAt)}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
