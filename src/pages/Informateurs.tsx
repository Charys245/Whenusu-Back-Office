import { useState, useRef } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormModal } from "@/components/shared/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Upload, X, Loader2 } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { useInformateurs } from "@/hooks/useInformateurs";
import { formatDate } from "@/utils/dateUtils";
import { ViewInformateurModal } from "@/components/informateurs/ViewInformateurModal";
import { EditInformateurModal } from "@/components/informateurs/EditInformateurModal";
import { DeleteConfirmDialog } from "@/components/informateurs/DeleteConfirmDialog";
import type { Informateur, CreateInformateurPayload } from "@/types/informateur";

export default function Informateurs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInformateur, setSelectedInformateur] =
    useState<Informateur | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state pour création
  const [formData, setFormData] = useState<{
    name: string;
    phoneNumber: string;
  }>({
    name: "",
    phoneNumber: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    informateurs,
    loading,
    createInformateur,
    updateInformateur,
    deleteInformateur,
  } = useInformateurs();

  // Filtrer les informateurs selon la recherche
  const filteredInformateurs = informateurs.filter(
    (informateur) =>
      informateur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      informateur.phoneNumber.includes(searchQuery)
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation du format
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Le format de la photo doit être jpg, jpeg, png ou webp.");
        return;
      }

      // Validation de la taille (10 Mo max)
      if (file.size > 10 * 1024 * 1024) {
        alert("La taille de la photo ne doit pas dépasser 10 Mo.");
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setFormData({ name: "", phoneNumber: "" });
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: CreateInformateurPayload = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
      };

      if (avatarFile) {
        payload.avatar_url = avatarFile;
      }

      await createInformateur(payload);
      setIsModalOpen(false);
      resetForm();
    } catch {
      // L'erreur est gérée dans le hook
    }
  };

  const handleView = (informateur: Informateur) => {
    setSelectedInformateur(informateur);
    setViewModalOpen(true);
  };

  const handleEdit = (informateur: Informateur) => {
    setSelectedInformateur(informateur);
    setEditModalOpen(true);
  };

  const handleDelete = (informateur: Informateur) => {
    setSelectedInformateur(informateur);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedInformateur) return;

    try {
      await deleteInformateur(selectedInformateur.id);
      setDeleteDialogOpen(false);
      setSelectedInformateur(null);
    } catch {
      // L'erreur est gérée dans le hook
    }
  };

  const columns: Column<Informateur>[] = [
    {
      key: "name",
      header: "Informateur",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {item.avatarUrl ? (
              <AvatarImage src={item.avatarUrl} alt={item.name} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(item.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phoneNumber",
      header: "Téléphone",
      render: (item) => <span>{item.phoneNumber}</span>,
    },
    {
      key: "createdAt",
      header: "Date de création",
      render: (item) => (
        <span>{item.createdAt ? formatDate(item.createdAt) : "-"}</span>
      ),
    },
    {
      key: "updatedAt",
      header: "Dernière modification",
      render: (item) => (
        <span>{item.updatedAt ? formatDate(item.updatedAt) : "-"}</span>
      ),
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Informateurs"
        subtitle="Gérer les informateurs culturels"
      />

      <div className="p-8 space-y-6">
        <PageHeader
          title="Liste des informateurs"
          subtitle={`${filteredInformateurs.length} informateur${filteredInformateurs.length > 1 ? "s" : ""} enregistré${filteredInformateurs.length > 1 ? "s" : ""}`}
          action={{ label: "Ajouter", onClick: () => setIsModalOpen(true) }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="w-64 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </PageHeader>

        {loading && informateurs.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Chargement...</span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredInformateurs}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Modal de création */}
        <FormModal
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) resetForm();
          }}
          title="Ajouter un informateur"
          description="Remplissez les informations du nouvel informateur"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Avatar upload */}
            <div className="space-y-2">
              <Label>Photo de profil (optionnel)</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Preview" />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(formData.name || "?")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choisir
                  </Button>
                  {avatarFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveAvatar}
                      disabled={loading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Retirer
                    </Button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, JPEG, PNG ou WebP. Max 10 Mo.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nom de l'informateur"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Numéro de téléphone *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="Numéro de téléphone"
                required
                minLength={8}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 8 caractères
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </FormModal>

        {/* Modal de visualisation */}
        <ViewInformateurModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          informateur={selectedInformateur}
        />

        {/* Modal d'édition */}
        <EditInformateurModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          informateur={selectedInformateur}
          onSubmit={updateInformateur}
          loading={loading}
        />

        {/* Dialog de suppression */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          informateur={selectedInformateur}
          onConfirm={confirmDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}
