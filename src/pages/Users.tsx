import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
}

const mockData: User[] = [
  {
    id: "1",
    name: "Admin WHENUSU",
    email: "admin@whenusu.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-20",
  },
  {
    id: "2",
    name: "Modérateur Culturel",
    email: "mod@whenusu.com",
    role: "moderator",
    status: "active",
    lastLogin: "2024-01-19",
  },
  {
    id: "3",
    name: "Marie Dupont",
    email: "marie@email.com",
    role: "user",
    status: "active",
    lastLogin: "2024-01-18",
  },
  {
    id: "4",
    name: "Jean Martin",
    email: "jean@email.com",
    role: "user",
    status: "inactive",
    lastLogin: "2024-01-10",
  },
  {
    id: "5",
    name: "Pierre Bernard",
    email: "pierre@email.com",
    role: "user",
    status: "suspended",
    lastLogin: "2024-01-05",
  },
];

const roleColors = {
  admin: "bg-primary/10 text-primary",
  moderator: "bg-secondary/10 text-secondary",
  user: "bg-muted text-muted-foreground",
};

const statusColors = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
  suspended: "bg-destructive/10 text-destructive",
};

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Utilisateur",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {item.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Rôle",
      render: (item) => (
        <Badge variant="secondary" className={roleColors[item.role]}>
          {item.role === "admin"
            ? "Admin"
            : item.role === "moderator"
            ? "Modérateur"
            : "Utilisateur"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (item) => (
        <Badge variant="secondary" className={statusColors[item.status]}>
          {item.status === "active"
            ? "Actif"
            : item.status === "inactive"
            ? "Inactif"
            : "Suspendu"}
        </Badge>
      ),
    },
    { key: "lastLogin", header: "Dernière connexion" },
  ];

  return (
    <div>
      <AdminHeader
        title="Utilisateurs"
        subtitle="Gérer les utilisateurs de la plateforme"
      />

      <div className="p-8 space-y-6">
        <PageHeader
          title="Liste des utilisateurs"
          subtitle={`${mockData.length} utilisateurs enregistrés`}
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
          title="Ajouter un utilisateur"
          description="Remplissez les informations du nouvel utilisateur"
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
              <Label htmlFor="role">Rôle</Label>
              <Input id="role" placeholder="Sélectionner un rôle" />
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
