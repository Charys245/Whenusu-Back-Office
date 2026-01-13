import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/shared/PageHeader";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";

interface ModerationItem {
  id: string;
  type: "tradition" | "comment" | "user";
  title: string;
  author: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

const mockData: ModerationItem[] = [
  {
    id: "1",
    type: "tradition",
    title: "Nouvelle tradition : Danse du Balafon",
    author: "Mamadou D.",
    status: "pending",
    submittedAt: "2024-01-20",
  },
  {
    id: "2",
    type: "comment",
    title: "Commentaire sur Sabar",
    author: "Fatou N.",
    status: "pending",
    submittedAt: "2024-01-19",
  },
  {
    id: "3",
    type: "tradition",
    title: "Mise à jour : Lutte Sénégalaise",
    author: "Ousmane F.",
    status: "approved",
    submittedAt: "2024-01-18",
  },
  {
    id: "4",
    type: "user",
    title: "Demande de rôle modérateur",
    author: "Aminata S.",
    status: "rejected",
    submittedAt: "2024-01-17",
  },
  {
    id: "5",
    type: "tradition",
    title: "Nouvelle tradition : Mbalax",
    author: "Ibrahima B.",
    status: "pending",
    submittedAt: "2024-01-16",
  },
];

const statusIcons = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
};

const statusColors = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

const typeColors = {
  tradition: "bg-primary/10 text-primary",
  comment: "bg-secondary/10 text-secondary",
  user: "bg-muted text-foreground",
};

export default function Moderation() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredData =
    activeTab === "all"
      ? mockData
      : mockData.filter((item) => item.status === activeTab);

  const columns: Column<ModerationItem>[] = [
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <Badge variant="secondary" className={typeColors[item.type]}>
          {item.type === "tradition"
            ? "Tradition"
            : item.type === "comment"
            ? "Commentaire"
            : "Utilisateur"}
        </Badge>
      ),
    },
    { key: "title", header: "Titre / Description" },
    { key: "author", header: "Auteur" },
    {
      key: "status",
      header: "Statut",
      render: (item) => {
        const Icon = statusIcons[item.status];
        return (
          <Badge variant="secondary" className={statusColors[item.status]}>
            <Icon className="mr-1 h-3 w-3" />
            {item.status === "pending"
              ? "En attente"
              : item.status === "approved"
              ? "Approuvé"
              : "Rejeté"}
          </Badge>
        );
      },
    },
    { key: "submittedAt", header: "Soumis le" },
  ];

  const pendingCount = mockData.filter(
    (item) => item.status === "pending"
  ).length;

  return (
    <div>
      <AdminHeader
        title="Modération"
        subtitle="Gérer les contenus en attente de validation"
      />

      <div className="p-8 space-y-6">
        <PageHeader
          title="File de modération"
          subtitle={`${pendingCount} élément(s) en attente de validation`}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Tous ({mockData.length})</TabsTrigger>
            <TabsTrigger value="pending">
              En attente ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="approved">Approuvés</TabsTrigger>
            <TabsTrigger value="rejected">Rejetés</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <DataTable
              columns={columns}
              data={filteredData}
              onView={(item) => console.log("View", item)}
              onEdit={(item) => console.log("Approve", item)}
              onDelete={(item) => console.log("Reject", item)}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        {activeTab === "pending" && pendingCount > 0 && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="text-success hover:text-success"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Tout approuver
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Tout rejeter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
