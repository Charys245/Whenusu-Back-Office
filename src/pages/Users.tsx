import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users as UsersIcon, UserPlus, Loader2 } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { ViewUserModal } from "@/components/users/ViewUserModal";
import { ManageUserRolesModal } from "@/components/users/ManageUserRolesModal";
import { formatDate } from "@/utils/dateUtils";
import type { User } from "@/types/User";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const { users, statistics, loading, fetchUsers } = useUsers();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [rolesModalOpen, setRolesModalOpen] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getProviderBadge = (provider: string | null) => {
    switch (provider) {
      case "google":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            Google
          </Badge>
        );
      case "apple":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            Apple
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Email
          </Badge>
        );
    }
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Utilisateur",
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone_number",
      header: "Téléphone",
      render: (user) => (
        <span className="text-muted-foreground">
          {user.phone_number || "-"}
        </span>
      ),
    },
    {
      key: "provider",
      header: "Connexion",
      render: (user) => getProviderBadge(user.provider),
    },
    {
      key: "send_notif",
      header: "Notifications",
      render: (user) => (
        <Badge
          variant="secondary"
          className={
            user.send_notif
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }
        >
          {user.send_notif ? "Activées" : "Désactivées"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Inscription",
      render: (user) =>
        user.created_at ? (
          <span className="text-muted-foreground text-sm">
            {formatDate(user.created_at)}
          </span>
        ) : (
          "-"
        ),
    },
  ];

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Utilisateurs"
        subtitle="Gérer les utilisateurs de la plateforme"
      />

      <div className="p-8 space-y-6">
        {/* Statistiques */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-full bg-primary/10">
                  <UsersIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total utilisateurs
                  </p>
                  <p className="text-2xl font-bold">{statistics.totalUsers}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-full bg-green-100">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Nouveaux ce mois
                  </p>
                  <p className="text-2xl font-bold">
                    {statistics.totalMonthUser}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <PageHeader
          title="Liste des utilisateurs"
          subtitle={`${users.length} utilisateurs`}
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
          data={users}
          onView={(user) => {
            setSelectedUser(user);
            setViewModalOpen(true);
          }}
        />

        <ViewUserModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          user={selectedUser}
          onManageRoles={(user) => {
            setSelectedUser(user);
            setViewModalOpen(false);
            setRolesModalOpen(true);
          }}
        />

        <ManageUserRolesModal
          open={rolesModalOpen}
          onOpenChange={setRolesModalOpen}
          user={selectedUser}
          onSuccess={() => {
            fetchUsers();
          }}
        />
      </div>
    </div>
  );
}
