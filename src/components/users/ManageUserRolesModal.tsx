import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const { roles, fetchRoles, assignRolesToUser, unassignRolesFromUser } =
    useRoles();

  const [roleIdInput, setRoleIdInput] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [unassignLoading, setUnassignLoading] = useState<string | null>(null);

  // Charger les rôles disponibles (quand l'endpoint sera prêt)
  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open, fetchRoles]);

  if (!user) return null;

  const userRoles = user.roles || [];
  const hasRoles = userRoles.length > 0;

  // Assigner un rôle
  const handleAssignRole = async () => {
    if (!roleIdInput.trim()) return;

    setAssignLoading(true);
    try {
      await assignRolesToUser(user.id, [roleIdInput.trim()]);
      setRoleIdInput("");
      onSuccess?.();
    } catch {
      // Error handled by hook
    } finally {
      setAssignLoading(false);
    }
  };

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

    setAssignLoading(true);
    try {
      await assignRolesToUser(user.id, [role.id]);
      onSuccess?.();
    } catch {
      // Error handled by hook
    } finally {
      setAssignLoading(false);
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

          {/* Liste des rôles disponibles (si GET /roles fonctionne) */}
          {roles.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Rôles disponibles</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableRoles.length > 0 ? (
                  availableRoles.map((role) => (
                    <Badge
                      key={role.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => handleAssignFromList(role)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {role.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Tous les rôles sont déjà assignés
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Formulaire manuel (si GET /roles n'est pas disponible) */}
          {roles.length === 0 && (
            <div className="space-y-2">
              <Label htmlFor="roleId">Assigner un rôle par ID</Label>
              <div className="flex gap-2">
                <Input
                  id="roleId"
                  placeholder="ID du rôle (UUID)"
                  value={roleIdInput}
                  onChange={(e) => setRoleIdInput(e.target.value)}
                  disabled={assignLoading}
                />
                <Button
                  onClick={handleAssignRole}
                  disabled={!roleIdInput.trim() || assignLoading}
                >
                  {assignLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                L'endpoint GET /roles n'est pas encore disponible. Saisissez l'ID du rôle manuellement.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
