import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/shared/PageHeader";

import { FormModal } from "@/components/shared/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { formatDate } from "@/utils/dateUtils";
import type { Language } from "@/types/language";
import { useLanguages } from "@/hooks/useLanguages";
import { ViewLanguageModal } from "@/components/languages/ViewLanguageModal";
import { EditLanguageModal } from "@/components/languages/EditLanguageModal";
import { DeleteConfirmDialog } from "@/components/regions/DeleteConfirmDialog";

// interface Langue {
//   id: string;
//   name: string;
//   code: string;
//   region: string;
//   speakers: string;
//   traditions: number;
// }

export default function Langues() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { languages, loading, createLanguage, updateLanguage, deleteLanguage } =
    useLanguages();

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [createFormData, setCreateFormData] = useState({
    name: "",
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLanguage(createFormData);
      setIsModalOpen(false);
      setCreateFormData({ name: "" });
    } catch (error) {
      // Erreur déjà gérée
    }
  };

  // const columns: Column<Langue>[] = [
  //   { key: "name", header: "Langue" },
  //   { key: "code", header: "Code" },
  //   { key: "region", header: "Région principale" },
  //   { key: "speakers", header: "Locuteurs" },
  //   { key: "traditions", header: "Traditions liées" },
  // ];

  const columns: Column<Language>[] = [
    {
      key: "name",
      header: "Langue",
      render: (language) => (
        <span className="font-medium text-foreground">{language.name}</span>
      ),
    },

    {
      key: "created_at",
      header: "Créé le",
      render: (language: Language) =>
        language.createdAt ? (
          <span className="text-muted-foreground text-xs">
            {formatDate(language.createdAt)}
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "updatedAt",
      header: "Modifié le",
      render: (language: Language) =>
        language.updatedAt ? (
          <span className="text-muted-foreground text-xs">
            {formatDate(language.updatedAt)}
          </span>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div>
      <AdminHeader title="Langues" subtitle="Gérer les langues documentées" />

      <div className="p-8 space-y-6">
        <PageHeader
          title="Liste des langues"
          subtitle={`${languages.length} langues enregistrées`}
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

        <DataTable
          columns={columns}
          data={languages}
          onView={(item) => {
            setSelectedLanguage(item);
            setViewModalOpen(true);
          }}
          onEdit={(item) => {
            setSelectedLanguage(item);
            setEditModalOpen(true);
          }}
          onDelete={(item) => {
            setSelectedLanguage(item);
            setDeleteDialogOpen(true);
          }}
        />

        <ViewLanguageModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          language={selectedLanguage}
        />

        <EditLanguageModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          language={selectedLanguage}
          onSubmit={updateLanguage}
          loading={loading}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          language={selectedLanguage}
          onConfirm={async () => {
            if (selectedLanguage?.id) {
              await deleteLanguage(selectedLanguage.id);
              setDeleteDialogOpen(false);
            }
          }}
          loading={loading}
        />

        <FormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title="Ajouter une langue"
          description="Remplissez les informations de la nouvelle langue"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Nom *</Label>
              <Input
                id="create-name"
                value={createFormData.name}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, name: e.target.value })
                }
                placeholder="Nom de la langue"
                required
                disabled={loading}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
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
      </div>
    </div>
  );
}
