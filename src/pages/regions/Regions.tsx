import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import type { Region } from "@/types/region";
import { useRegions } from "@/hooks/useRegions";
import { formatDate } from "@/utils/dateUtils";
import { DeleteConfirmDialog } from "@/components/regions/DeleteConfirmDialog";
import { EditRegionModal } from "@/components/regions/EditRegionModal";
import { ViewRegionModal } from "@/components/regions/ViewRegionModal";

export default function Regions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { regions, loading, createRegion, updateRegion, deleteRegion } =
    useRegions();

  const [createFormData, setCreateFormData] = useState({
    name: "",
    location: "",
    longitude: 0,
    latitude: 0,
  });

  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // const columns: Column<Region>[] = [
  //   { key: "name", header: "Région" },
  //   { key: "location", header: "Localisation" },
  //   { key: "longitude", header: "Longitude" },
  //   { key: "latitude", header: "Latitude" },
  //   {
  //     key: "createdAt",
  //     header: "Date de création",
  //     render: (region: Region) =>
  //       region.createdAt ? formatDate(region.createdAt) : "-",
  //   },
  //   {
  //     key: "updatedAt",
  //     header: "Date de mise à jour",
  //     render: (region: Region) =>
  //       region.updatedAt ? formatDate(region.updatedAt) : "-",
  //   },
  // ];

  const columns: Column<Region>[] = [
    {
      key: "name",
      header: "Région",
      render: (region) => (
        <span className="font-medium text-foreground">{region.name}</span>
      ),
    },
    { key: "location", header: "Localisation" },
    {
      key: "longitude",
      header: "Longitude",
      render: (region) => (
        <span className="">{region.longitude}°</span>
      ),
    },
    {
      key: "latitude",
      header: "Latitude",
      render: (region) => (
        <span className=" ">{region.latitude}°</span>
      ),
    },
    {
      key: "createdAt",
      header: "Créé le",
      render: (region: Region) =>
        region.createdAt ? (
          <span className="text-muted-foreground">
            {formatDate(region.createdAt)}
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "updatedAt",
      header: "Mise à jour le",
      render: (region: Region) =>
        region.updatedAt ? (
          <span className="text-muted-foreground">
            {formatDate(region.updatedAt)}
          </span>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div>
      <AdminHeader title="Régions" subtitle="Gérer les régions géographiques" />

      <div className="p-8 space-y-6">
        <PageHeader
          title="Liste des régions"
          subtitle={`${regions.length} régions enregistrées`}
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
          data={regions}
          onView={(item) => {
            setSelectedRegion(item);
            setViewModalOpen(true);
          }}
          onEdit={(item) => {
            setSelectedRegion(item);
            setEditModalOpen(true);
          }}
          onDelete={(item) => {
            setSelectedRegion(item);
            setDeleteDialogOpen(true);
          }}
        />

        <ViewRegionModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          region={selectedRegion}
        />

        <EditRegionModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          region={selectedRegion}
          onSubmit={updateRegion}
          loading={loading}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          region={selectedRegion}
          onConfirm={async () => {
            if (selectedRegion?.id) {
              await deleteRegion(selectedRegion.id);
              setDeleteDialogOpen(false);
            }
          }}
          loading={loading}
        />

        <FormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title="Ajouter une région"
          description="Remplissez les informations de la nouvelle région"
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await createRegion(createFormData);
                setIsModalOpen(false);
                // Réinitialiser le formulaire
                setCreateFormData({
                  name: "",
                  location: "",
                  longitude: 0,
                  latitude: 0,
                });
              } catch (error) {
                // L'erreur est déjà gérée dans le hook avec toast
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="create-name">Nom *</Label>
              <Input
                id="create-name"
                value={createFormData.name}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, name: e.target.value })
                }
                placeholder="Nom de la région"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-location">Localisation *</Label>
              <Input
                id="create-location"
                value={createFormData.location}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    location: e.target.value,
                  })
                }
                placeholder="Localisation"
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-longitude">Longitude *</Label>
                <Input
                  id="create-longitude"
                  type="number"
                  step="any"
                  value={createFormData.longitude}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      longitude: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.0"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-latitude">Latitude *</Label>
                <Input
                  id="create-latitude"
                  type="number"
                  step="any"
                  value={createFormData.latitude}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      latitude: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.0"
                  required
                  disabled={loading}
                />
              </div>
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
