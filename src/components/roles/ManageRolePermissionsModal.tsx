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
import { Loader2, Plus, X, Key } from "lucide-react";
import { useRoles } from "@/hooks/useRoles";
import type { Role, Permission } from "@/types/Role";

interface ManageRolePermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onSuccess?: () => void;
}

export const ManageRolePermissionsModal = ({
  open,
  onOpenChange,
  role,
  onSuccess,
}: ManageRolePermissionsModalProps) => {
  const {
    permissions,
    permissionsQuery,
    assignPermissionToRole,
    unassignPermissionFromRole,
  } = useRoles();

  const [unassignLoading, setUnassignLoading] = useState<string | null>(null);
  const [assignLoading, setAssignLoading] = useState<string | null>(null);

  // State local pour suivre les permissions assignées
  // Initialisé avec role.permissions (quand le backend le retournera)
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());

  // Réinitialiser quand on ouvre le modal avec un nouveau rôle
  useEffect(() => {
    if (open && role) {
      // Initialiser avec les permissions du backend (si disponibles)
      const initialIds = new Set((role.permissions || []).map((p) => p.id));
      setAssignedIds(initialIds);
    }
  }, [open, role?.id]);

  if (!role) return null;

  // Permissions assignées (objets complets pour l'affichage)
  const assignedPermissions = permissions.filter((p) => assignedIds.has(p.id));
  const hasPermissions = assignedPermissions.length > 0;

  // Permissions disponibles (non assignées)
  const availablePermissions = permissions.filter((p) => !assignedIds.has(p.id));

  // Retirer une permission
  const handleUnassignPermission = async (permissionId: string) => {
    setUnassignLoading(permissionId);
    try {
      await unassignPermissionFromRole(role.id, permissionId);
      // Retirer du state local
      setAssignedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(permissionId);
        return newSet;
      });
      onSuccess?.();
    } catch {
      // Error handled by hook
    } finally {
      setUnassignLoading(null);
    }
  };

  // Assigner une permission
  const handleAssignPermission = async (permission: Permission) => {
    if (assignedIds.has(permission.id)) return;

    setAssignLoading(permission.id);
    try {
      await assignPermissionToRole(role.id, permission.id);
      // Ajouter au state local
      setAssignedIds((prev) => new Set(prev).add(permission.id));
      onSuccess?.();
    } catch {
      // Error handled by hook
    } finally {
      setAssignLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Gérer les permissions
          </DialogTitle>
          <DialogDescription>
            Rôle : <strong>{role.name}</strong> ({role.slug})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Permissions actuelles du rôle */}
          <div>
            <Label className="text-sm font-medium">Permissions actuelles</Label>
            {hasPermissions ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {assignedPermissions.map((permission) => (
                  <Badge
                    key={permission.id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {permission.name}
                    <button
                      onClick={() => handleUnassignPermission(permission.id)}
                      disabled={unassignLoading === permission.id}
                      className="ml-1 hover:bg-destructive/20 rounded p-0.5"
                    >
                      {unassignLoading === permission.id ? (
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
                Aucune permission assignée
              </p>
            )}
          </div>

          {/* Liste des permissions disponibles */}
          <div>
            <Label className="text-sm font-medium">Permissions disponibles</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {permissionsQuery.isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chargement des permissions...
                </div>
              ) : availablePermissions.length > 0 ? (
                availablePermissions.map((permission) => (
                  <Badge
                    key={permission.id}
                    variant="outline"
                    className={`cursor-pointer hover:bg-primary/10 ${assignLoading === permission.id ? "opacity-50" : ""}`}
                    onClick={() => !assignLoading && handleAssignPermission(permission)}
                  >
                    {assignLoading === permission.id ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3 mr-1" />
                    )}
                    {permission.name}
                  </Badge>
                ))
              ) : permissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune permission disponible. Créez des permissions d'abord.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Toutes les permissions sont déjà assignées
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
