import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormModal } from "@/components/shared/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2 } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { useCategories } from "@/hooks/useCategories";
import { ViewCategoryModal } from "@/components/categories/ViewCategoryModal";
import { EditCategoryModal } from "@/components/categories/EditCategoryModal";
import { DeleteConfirmDialog } from "@/components/categories/DeleteConfirmDialog";
import { formatDate } from "@/utils/dateUtils";
import type { Category } from "@/types/category";

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state pour création
  const [createFormData, setCreateFormData] = useState({
    name: "",
  });

  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  // Filtrer les catégories selon la recherche
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setCreateFormData({ name: "" });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCategory(createFormData);
      setIsModalOpen(false);
      resetForm();
    } catch {
      // L'erreur est gérée dans le hook
    }
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setViewModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory.id);
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch {
      // L'erreur est gérée dans le hook
    }
  };

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Catégorie",
      render: (category) => (
        <span className="font-medium text-foreground">{category.name}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (category) => (
        <span className="text-muted-foreground">{category.slug || "-"}</span>
      ),
    },
    {
      key: "created_at",
      header: "Date de création",
      render: (category) => (
        <span className="text-muted-foreground text-sm">
          {category.created_at ? formatDate(category.created_at) : "-"}
        </span>
      ),
    },
    {
      key: "updated_at",
      header: "Dernière modification",
      render: (category) => (
        <span className="text-muted-foreground text-sm">
          {category.updated_at ? formatDate(category.updated_at) : "-"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Catégories"
        subtitle="Gérer les catégories de traditions"
      />

      <div className="p-8 space-y-6">
        <PageHeader
          title="Liste des catégories"
          subtitle={`${filteredCategories.length} catégorie${filteredCategories.length > 1 ? "s" : ""} enregistrée${filteredCategories.length > 1 ? "s" : ""}`}
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

        {loading && categories.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Chargement...</span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredCategories}
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
          title="Ajouter une catégorie"
          description="Remplissez les informations de la nouvelle catégorie"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={createFormData.name}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, name: e.target.value })
                }
                placeholder="Nom de la catégorie"
                required
                disabled={loading}
              />
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
        <ViewCategoryModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          category={selectedCategory}
        />

        {/* Modal d'édition */}
        <EditCategoryModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          category={selectedCategory}
          onSubmit={updateCategory}
          loading={loading}
        />

        {/* Dialog de suppression */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          category={selectedCategory}
          onConfirm={confirmDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}
