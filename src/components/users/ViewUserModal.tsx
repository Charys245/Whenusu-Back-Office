import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import type { User } from "@/types/User";
import { formatDateTime } from "@/utils/dateUtils";
import {
  getUserFirstName,
  getUserLastName,
  getUserInitials,
  getUserPhoneNumber,
  getUserAvatarUrl,
  getUserSendNotif,
  getUserCreatedAt,
  getUserUpdatedAt,
} from "@/utils/userUtils";

interface ViewUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onManageRoles?: (user: User) => void;
}

export const ViewUserModal = ({
  open,
  onOpenChange,
  user,
  onManageRoles,
}: ViewUserModalProps) => {
  if (!user) return null;

  const firstName = getUserFirstName(user);
  const lastName = getUserLastName(user);
  const initials = getUserInitials(user);
  const phoneNumber = getUserPhoneNumber(user);
  const avatarUrl = getUserAvatarUrl(user);
  const sendNotif = getUserSendNotif(user);
  const createdAt = getUserCreatedAt(user);
  const updatedAt = getUserUpdatedAt(user);

  const getProviderLabel = (provider: string | null | undefined) => {
    switch (provider) {
      case "google":
        return "Google";
      case "apple":
        return "Apple";
      case "local":
        return "Email";
      default:
        return provider || "Email";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de l'utilisateur</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar et nom */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">
                {firstName} {lastName}
              </h3>
              <p className="text-muted-foreground">{user.email || "-"}</p>
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Prénom</p>
              <p className="text-base">{firstName || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nom</p>
              <p className="text-base">{lastName || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{user.email || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Téléphone
              </p>
              <p className="text-base">{phoneNumber || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Fournisseur d'authentification
              </p>
              <Badge variant="secondary" className="mt-1">
                {getProviderLabel(user.provider)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Notifications
              </p>
              <Badge
                variant="secondary"
                className={`mt-1 ${
                  sendNotif
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {sendNotif ? "Activées" : "Désactivées"}
              </Badge>
            </div>
          </div>

          {/* Affichage des rôles (nouveau format: tableau) */}
          {user.roles && user.roles.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rôle(s)</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.roles.map((role) => (
                  <Badge key={role.id} variant="outline">
                    {role.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {/* Rétrocompatibilité: ancien format (string) */}
          {!user.roles?.length && user.role && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rôle</p>
              <Badge variant="outline" className="mt-1">
                {user.role}
              </Badge>
            </div>
          )}

          {/* Dates */}
          <div className="pt-4 border-t grid grid-cols-2 gap-4">
            {createdAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date d'inscription
                </p>
                <p className="text-base">{formatDateTime(createdAt)}</p>
              </div>
            )}
            {updatedAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Dernière modification
                </p>
                <p className="text-base">{formatDateTime(updatedAt)}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {onManageRoles && (
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => onManageRoles(user)}
                className="w-full"
              >
                <Shield className="mr-2 h-4 w-4" />
                Gérer les rôles
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
