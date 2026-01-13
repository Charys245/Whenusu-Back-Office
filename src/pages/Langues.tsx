import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/shared/PageHeader";

import { FormModal } from "@/components/shared/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";

interface Langue {
  id: string;
  name: string;
  code: string;
  region: string;
  speakers: string;
  traditions: number;
}

const mockData: Langue[] = [
  { id: "1", name: "Wolof", code: "WOL", region: "Sénégal", speakers: "5M+", traditions: 45 },
  { id: "2", name: "Diola", code: "DIO", region: "Casamance", speakers: "500K+", traditions: 32 },
  { id: "3", name: "Serer", code: "SER", region: "Sine-Saloum", speakers: "1.5M+", traditions: 28 },
  { id: "4", name: "Peul", code: "PEU", region: "Fouta", speakers: "3M+", traditions: 38 },
  { id: "5", name: "Mandingue", code: "MAN", region: "Casamance", speakers: "1M+", traditions: 25 },
];

export default function Langues() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const columns: Column<Langue>[] = [
    { key: "name", header: "Langue" },
    { key: "code", header: "Code" },
    { key: "region", header: "Région principale" },
    { key: "speakers", header: "Locuteurs" },
    { key: "traditions", header: "Traditions liées" },
  ];

  return (
    <div>
      <AdminHeader title="Langues" subtitle="Gérer les langues documentées" />
      
      <div className="p-8 space-y-6">
        <PageHeader
          title="Liste des langues"
          subtitle={`${mockData.length} langues enregistrées`}
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
          title="Ajouter une langue"
          description="Remplissez les informations de la nouvelle langue"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" placeholder="Nom de la langue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input id="code" placeholder="WOL" maxLength={3} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Région principale</Label>
              <Input id="region" placeholder="Région" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Description de la langue..." rows={3} />
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
