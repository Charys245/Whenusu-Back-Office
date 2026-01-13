import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormModal } from "@/components/shared/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";

interface Informateur {
  id: string;
  name: string;
  email: string;
  region: string;
  traditions: number;
  status: "active" | "inactive";
  joinedAt: string;
}

const mockData: Informateur[] = [
  { id: "1", name: "Mamadou Diallo", email: "m.diallo@email.com", region: "Casamance", traditions: 12, status: "active", joinedAt: "2024-01-15" },
  { id: "2", name: "Fatou Ndiaye", email: "f.ndiaye@email.com", region: "Dakar", traditions: 8, status: "active", joinedAt: "2024-01-10" },
  { id: "3", name: "Ousmane Fall", email: "o.fall@email.com", region: "Saint-Louis", traditions: 5, status: "inactive", joinedAt: "2024-01-05" },
  { id: "4", name: "Aminata Sow", email: "a.sow@email.com", region: "Thiès", traditions: 15, status: "active", joinedAt: "2023-12-20" },
  { id: "5", name: "Ibrahima Ba", email: "i.ba@email.com", region: "Ziguinchor", traditions: 10, status: "active", joinedAt: "2023-12-15" },
];

export default function Informateurs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const columns: Column<Informateur>[] = [
    {
      key: "name",
      header: "Informateur",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {item.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    { key: "region", header: "Région" },
    { key: "traditions", header: "Traditions" },
    {
      key: "status",
      header: "Statut",
      render: (item) => (
        <Badge variant="secondary" className={item.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
          {item.status === "active" ? "Actif" : "Inactif"}
        </Badge>
      ),
    },
    { key: "joinedAt", header: "Inscrit le" },
  ];

  return (
    <div>
      <AdminHeader title="Informateurs" subtitle="Gérer les informateurs culturels" />
      
      <div className="p-8 space-y-6">
        <PageHeader
          title="Liste des informateurs"
          subtitle={`${mockData.length} informateurs enregistrés`}
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
          title="Ajouter un informateur"
          description="Remplissez les informations du nouvel informateur"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Prénom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="Nom" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Région</Label>
              <Input id="region" placeholder="Sélectionner une région" />
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
