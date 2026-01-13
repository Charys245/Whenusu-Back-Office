import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface Tradition {
  id: string;
  name: string;
  region: string;
  language: string;
  type: string;
  status: "published" | "draft" | "pending";
  createdAt: string;
}

const mockData: Tradition[] = [
  { id: "1", name: "Danse Ekonting", region: "Casamance", language: "Diola", type: "Musique", status: "published", createdAt: "2024-01-15" },
  { id: "2", name: "Sabar", region: "Dakar", language: "Wolof", type: "Danse", status: "published", createdAt: "2024-01-12" },
  { id: "3", name: "Lutte sénégalaise", region: "Thiès", language: "Serer", type: "Sport", status: "draft", createdAt: "2024-01-10" },
  { id: "4", name: "Kankurang", region: "Casamance", language: "Mandingue", type: "Rituel", status: "pending", createdAt: "2024-01-08" },
  { id: "5", name: "Ndeup", region: "Sine-Saloum", language: "Serer", type: "Rituel", status: "published", createdAt: "2024-01-05" },
];

const statusColors = {
  published: "bg-success/10 text-success",
  draft: "bg-muted text-muted-foreground",
  pending: "bg-warning/10 text-warning",
};

export default function Traditions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const columns: Column<Tradition>[] = [
    { key: "name", header: "Nom de la tradition" },
    { key: "region", header: "Région" },
    { key: "language", header: "Langue" },
    { key: "type", header: "Type" },
    {
      key: "status",
      header: "Statut",
      render: (item) => (
        <Badge variant="secondary" className={statusColors[item.status]}>
          {item.status === "published" ? "Publié" : item.status === "draft" ? "Brouillon" : "En attente"}
        </Badge>
      ),
    },
    { key: "createdAt", header: "Date de création" },
  ];

  return (
    <div>
      <AdminHeader title="Traditions" subtitle="Gérer les traditions culturelles" />
      
      <div className="p-8 space-y-6">
        <PageHeader
          title="Liste des traditions"
          subtitle={`${mockData.length} traditions enregistrées`}
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
          title="Ajouter une tradition"
          description="Remplissez les informations de la nouvelle tradition"
        >
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" placeholder="Nom de la tradition" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Région</Label>
                <Input id="region" placeholder="Sélectionner une région" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Input id="language" placeholder="Sélectionner une langue" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Description de la tradition..." rows={4} />
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
