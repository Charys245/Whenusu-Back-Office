import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Key,
  Plus,
  Loader2,
  Settings,
} from "lucide-react";
import { useRoles } from "@/hooks/useRoles";
import { ManageRolePermissionsModal } from "@/components/roles/ManageRolePermissionsModal";

export default function Roles() {
  const {
    roles,
    permissions,
    loading,
    createRole,
    createPermission,
    fetchRoles,
    fetchPermissions,
  } = useRoles();

  // State pour les modals
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [createPermissionOpen, setCreatePermissionOpen] = useState(false);
  const [managePermissionsOpen, setManagePermissionsOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // Trouver le rôle sélectionné dans la liste (toujours à jour)
  const selectedRole = selectedRoleId
    ? roles.find((r) => r.id === selectedRoleId) || null
    : null;

  // State pour le formulaire de création de rôle
  const [roleName, setRoleName] = useState("");
  const [roleSlug, setRoleSlug] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [roleLoading, setRoleLoading] = useState(false);

  // State pour le formulaire de création de permission
  const [permissionName, setPermissionName] = useState("");
  const [permissionSlug, setPermissionSlug] = useState("");
  const [permissionDescription, setPermissionDescription] = useState("");
  const [permissionLoading, setPermissionLoading] = useState(false);

  // Générer le slug automatiquement
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Créer un rôle
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim() || !roleSlug.trim()) return;

    setRoleLoading(true);
    try {
      await createRole({
        name: roleName.trim(),
        slug: roleSlug.trim(),
        description: roleDescription.trim() || undefined,
      });
      // Reset form
      setRoleName("");
      setRoleSlug("");
      setRoleDescription("");
      setCreateRoleOpen(false);
    } catch {
      // Error handled by hook
    } finally {
      setRoleLoading(false);
    }
  };

  // Créer une permission
  const handleCreatePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionName.trim() || !permissionSlug.trim()) return;

    setPermissionLoading(true);
    try {
      await createPermission({
        name: permissionName.trim(),
        slug: permissionSlug.trim(),
        description: permissionDescription.trim() || undefined,
      });
      // Reset form
      setPermissionName("");
      setPermissionSlug("");
      setPermissionDescription("");
      setCreatePermissionOpen(false);
    } catch {
      // Error handled by hook
    } finally {
      setPermissionLoading(false);
    }
  };

  // Charger les données au changement d'onglet
  const handleTabChange = (value: string) => {
    if (value === "roles") {
      fetchRoles();
    } else if (value === "permissions") {
      fetchPermissions();
    }
  };

  return (
    <div>
      <AdminHeader
        title="Rôles & Permissions"
        subtitle="Gérer les rôles et permissions de la plateforme"
      />

      <div className="p-8">
        <Tabs defaultValue="roles" className="space-y-6" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="roles" className="gap-2">
              <Shield className="h-4 w-4" />
              Rôles
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2">
              <Key className="h-4 w-4" />
              Permissions
            </TabsTrigger>
          </TabsList>

          {/* Onglet Rôles */}
          <TabsContent value="roles" className="space-y-6">
            {/* Header avec bouton créer */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Liste des rôles</h2>
                <p className="text-sm text-muted-foreground">
                  Les rôles définissent les groupes de permissions
                </p>
              </div>
              <Dialog open={createRoleOpen} onOpenChange={setCreateRoleOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un rôle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau rôle</DialogTitle>
                    <DialogDescription>
                      Un rôle regroupe plusieurs permissions et peut être assigné aux utilisateurs.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateRole} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="roleName">Nom du rôle *</Label>
                      <Input
                        id="roleName"
                        placeholder="Ex: Administrateur"
                        value={roleName}
                        onChange={(e) => {
                          setRoleName(e.target.value);
                          setRoleSlug(generateSlug(e.target.value));
                        }}
                        disabled={roleLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roleSlug">Slug *</Label>
                      <Input
                        id="roleSlug"
                        placeholder="Ex: admin"
                        value={roleSlug}
                        onChange={(e) => setRoleSlug(e.target.value)}
                        disabled={roleLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Identifiant unique (lettres minuscules, chiffres, tirets)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roleDescription">Description</Label>
                      <Textarea
                        id="roleDescription"
                        placeholder="Description du rôle..."
                        value={roleDescription}
                        onChange={(e) => setRoleDescription(e.target.value)}
                        disabled={roleLoading}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCreateRoleOpen(false)}
                        disabled={roleLoading}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={!roleName.trim() || !roleSlug.trim() || roleLoading}
                      >
                        {roleLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Création...
                          </>
                        ) : (
                          "Créer le rôle"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Liste des rôles */}
            <Card>
              <CardHeader>
                <CardTitle>Rôles existants</CardTitle>
                <CardDescription>
                  {roles.length > 0
                    ? `${roles.length} rôle(s) trouvé(s)`
                    : "Aucun rôle chargé"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : roles.length > 0 ? (
                  <div className="space-y-3">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="font-medium">{role.name}</span>
                            <Badge variant="secondary">{role.slug}</Badge>
                          </div>
                          {role.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {role.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {role.permissions && role.permissions.length > 0 && (
                            <Badge variant="outline">
                              {role.permissions.length} permission(s)
                            </Badge>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRoleId(role.id);
                              setManagePermissionsOpen(true);
                            }}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Permissions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aucun rôle pour le moment</p>
                    <p className="text-sm">
                      Créez votre premier rôle en cliquant sur le bouton ci-dessus.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Permissions */}
          <TabsContent value="permissions" className="space-y-6">
            {/* Header avec bouton créer */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Liste des permissions</h2>
                <p className="text-sm text-muted-foreground">
                  Les permissions définissent les actions autorisées
                </p>
              </div>
              <Dialog open={createPermissionOpen} onOpenChange={setCreatePermissionOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une permission
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle permission</DialogTitle>
                    <DialogDescription>
                      Une permission définit une action spécifique dans le système.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreatePermission} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="permissionName">Nom de la permission *</Label>
                      <Input
                        id="permissionName"
                        placeholder="Ex: Créer un utilisateur"
                        value={permissionName}
                        onChange={(e) => {
                          setPermissionName(e.target.value);
                          setPermissionSlug(generateSlug(e.target.value));
                        }}
                        disabled={permissionLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permissionSlug">Slug *</Label>
                      <Input
                        id="permissionSlug"
                        placeholder="Ex: create-user"
                        value={permissionSlug}
                        onChange={(e) => setPermissionSlug(e.target.value)}
                        disabled={permissionLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Identifiant unique (lettres minuscules, chiffres, tirets)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permissionDescription">Description</Label>
                      <Textarea
                        id="permissionDescription"
                        placeholder="Description de la permission..."
                        value={permissionDescription}
                        onChange={(e) => setPermissionDescription(e.target.value)}
                        disabled={permissionLoading}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCreatePermissionOpen(false)}
                        disabled={permissionLoading}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          !permissionName.trim() ||
                          !permissionSlug.trim() ||
                          permissionLoading
                        }
                      >
                        {permissionLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Création...
                          </>
                        ) : (
                          "Créer la permission"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Liste des permissions */}
            <Card>
              <CardHeader>
                <CardTitle>Permissions existantes</CardTitle>
                <CardDescription>
                  {permissions.length > 0
                    ? `${permissions.length} permission(s) trouvée(s)`
                    : "Aucune permission chargée"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : permissions.length > 0 ? (
                  <div className="space-y-3">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-primary" />
                            <span className="font-medium">{permission.name}</span>
                            <Badge variant="secondary">{permission.slug}</Badge>
                          </div>
                          {permission.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aucune permission pour le moment</p>
                    <p className="text-sm">
                      Créez votre première permission en cliquant sur le bouton ci-dessus.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Permissions utilisées dans l'API */}
            <Card>
              <CardHeader>
                <CardTitle>Permissions utilisées dans l'API</CardTitle>
                <CardDescription>
                  Liste des permissions référencées dans la documentation de l'API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { slug: "create-role", description: "Créer un rôle" },
                    { slug: "assign-permission-to-role", description: "Assigner permission à rôle" },
                    { slug: "unassign-permission-to-role", description: "Retirer permission d'un rôle" },
                    { slug: "create-permission", description: "Créer une permission" },
                    { slug: "assign-role-to-user", description: "Assigner rôle à user" },
                    { slug: "unassign-role-to-user", description: "Retirer rôle d'un user" },
                    { slug: "get-users", description: "Lister les users" },
                  ].map((perm) => (
                    <div
                      key={perm.slug}
                      className="flex items-center gap-2 p-2 bg-muted/50 rounded"
                    >
                      <Badge variant="outline" className="font-mono text-xs">
                        {perm.slug}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {perm.description}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal pour gérer les permissions d'un rôle */}
        <ManageRolePermissionsModal
          open={managePermissionsOpen}
          onOpenChange={setManagePermissionsOpen}
          role={selectedRole}
          onSuccess={() => {
            fetchRoles();
          }}
        />
      </div>
    </div>
  );
}
