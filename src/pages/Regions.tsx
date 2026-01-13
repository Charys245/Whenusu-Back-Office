import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";

interface Region {
  id: string;
  name: string;
  country: string;
  languages: number;
  traditions: number;
  informateurs: number;
}

const mockData: Region[] = [
  {
    id: "1",
    name: "Casamance",
    country: "Sénégal",
    languages: 5,
    traditions: 78,
    informateurs: 23,
  },
  {
    id: "2",
    name: "Dakar",
    country: "Sénégal",
    languages: 3,
    traditions: 45,
    informateurs: 15,
  },
  {
    id: "3",
    name: "Saint-Louis",
    country: "Sénégal",
    languages: 4,
    traditions: 52,
    informateurs: 18,
  },
  {
    id: "4",
    name: "Thiès",
    country: "Sénégal",
    languages: 3,
    traditions: 38,
    informateurs: 12,
  },
  {
    id: "5",
    name: "Sine-Saloum",
    country: "Sénégal",
    languages: 2,
    traditions: 41,
    informateurs: 14,
  },
];

export default function Regions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const columns: Column<Region>[] = [
    { key: "name", header: "Région" },
    { key: "country", header: "Pays" },
    { key: "languages", header: "Langues" },
    { key: "traditions", header: "Traditions" },
    { key: "informateurs", header: "Informateurs" },
  ];

  return (
    <div>
      <AdminHeader title="Régions" subtitle="Gérer les régions géographiques" />

      <div className="p-8 space-y-6">
        <PageHeader
          title="Liste des régions"
          subtitle={`${mockData.length} régions enregistrées`}
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
          data={mockData}
          onView={(item) => console.log("View", item)}
          onEdit={(item) => console.log("Edit", item)}
          onDelete={(item) => console.log("Delete", item)}
        />

        <FormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title="Ajouter une région"
          description="Remplissez les informations de la nouvelle région"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" placeholder="Nom de la région" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input id="country" placeholder="Pays" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description de la région..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button type="button" onClick={() => setIsModalOpen(false)}>
                Enregistrer
              </Button>
            </div>
          </form>
        </FormModal>
      </div>
    </div>
  );
}
