import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X, Shield } from "lucide-react";
import { useRoles } from "@/hooks/useRoles";
import type { User } from "@/types/User";
import type { Role } from "@/types/Role";

interface ManageUserRolesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSuccess?: () => void;
}

export const ManageUserRolesModal = ({
  open,
  onOpenChange,
  user,
  onSuccess,
}: ManageUserRolesModalProps) => {
  const { roles, rolesQuery, assignRolesToUser, unassignRolesFromUser } =
    useRoles();

  const [unassignLoading, setUnassignLoading] = useState<string | null>(null);
  const [assigningRoleId, setAssigningRoleId] = useState<string | null>(null);

  if (!user) return null;

  const userRoles = user.roles || [];
  const hasRoles = userRoles.length > 0;

  // Retirer un rôle
  const handleUnassignRole = async (roleId: string) => {
    setUnassignLoading(roleId);
    try {
      await unassignRolesFromUser(user.id, [roleId]);
      onSuccess?.();
    } catch {
      // Error handled by hook
    } finally {
      setUnassignLoading(null);
    }
  };

  // Assigner depuis la liste des rôles disponibles
  const handleAssignFromList = async (role: Role) => {
    // Vérifier si le rôle n'est pas déjà assigné
    if (userRoles.some((r) => r.id === role.id)) {
      return;
    }

    setAssigningRoleId(role.id);
    try {
      await assignRolesToUser(user.id, [role.id]);
      onSuccess?.();
    } catch {
      // Error handled by hook
    } finally {
      setAssigningRoleId(null);
    }
  };

  // Filtrer les rôles disponibles (non assignés à l'utilisateur)
  const availableRoles = roles.filter(
    (role) => !userRoles.some((r) => r.id === role.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gérer les rôles
          </DialogTitle>
          <DialogDescription>
            {user.first_name} {user.last_name} ({user.email})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rôles actuels de l'utilisateur */}
          <div>
            <Label className="text-sm font-medium">Rôles actuels</Label>
            {hasRoles ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {userRoles.map((role) => (
                  <Badge
                    key={role.id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {role.name}
                    <button
                      onClick={() => handleUnassignRole(role.id)}
                      disabled={unassignLoading === role.id}
                      className="ml-1 hover:bg-destructive/20 rounded p-0.5"
                    >
                      {unassignLoading === role.id ? (
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
                Aucun rôle assigné
              </p>
            )}
          </div>

          {/* Liste des rôles disponibles */}
          <div>
            <Label className="text-sm font-medium">Rôles disponibles</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {rolesQuery.isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chargement des rôles...
                </div>
              ) : availableRoles.length > 0 ? (
                availableRoles.map((role) => (
                  <Badge
                    key={role.id}
                    variant="outline"
                    className={`cursor-pointer hover:bg-primary/10 ${assigningRoleId === role.id ? "opacity-50" : ""}`}
                    onClick={() => !assigningRoleId && handleAssignFromList(role)}
                  >
                    {assigningRoleId === role.id ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3 mr-1" />
                    )}
                    {role.name}
                  </Badge>
                ))
              ) : roles.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun rôle disponible
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Tous les rôles sont déjà assignés
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
