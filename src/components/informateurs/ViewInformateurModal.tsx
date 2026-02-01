import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateTime } from "@/utils/dateUtils";
import type { Informateur } from "@/types/informateur";

interface ViewInformateurModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  informateur: Informateur | null;
}

export const ViewInformateurModal = ({
  open,
  onOpenChange,
  informateur,
}: ViewInformateurModalProps) => {
  if (!informateur) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de l'informateur</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar et nom */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {informateur.avatarUrl ? (
                <AvatarImage
                  src={informateur.avatarUrl}
                  alt={informateur.name}
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {getInitials(informateur.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{informateur.name}</h3>
              <p className="text-muted-foreground">{informateur.phoneNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nom</p>
              <p className="text-base font-semibold">{informateur.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Numéro de téléphone
              </p>
              <p className="text-base">{informateur.phoneNumber}</p>
            </div>

            {informateur.createdAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date de création
                </p>
                <p className="text-base">
                  {formatDateTime(informateur.createdAt)}
                </p>
              </div>
            )}

            {informateur.updatedAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Dernière modification
                </p>
                <p className="text-base">
                  {formatDateTime(informateur.updatedAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
