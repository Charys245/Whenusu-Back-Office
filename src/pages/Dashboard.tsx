import { AdminHeader } from "@/components/layout/AdminHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { TimeFilter } from "@/components/dashboard/TimeFilter";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { BookOpen, Languages, MapPin, Users, FolderOpen, Mic, UserPlus } from "lucide-react";
import ConsultationsChart from "@/components/dashboard/ConsultationsChart";
import { useIsAuthenticated, useUserFullName } from "@/hooks/useAuth";
import { useTraditions } from "@/hooks/useTraditions";
import { useLanguages } from "@/hooks/useLanguages";
import { useRegions } from "@/hooks/useRegions";
import { useCategories } from "@/hooks/useCategories";
import { useInformateurs } from "@/hooks/useInformateurs";
import { useUsers } from "@/hooks/useUsers";

export default function Dashboard() {
  const isAuth = useIsAuthenticated();
  const fullName = useUserFullName();

  // Récupérer les données dynamiques
  const { meta: traditionsMeta, loading: traditionsLoading } = useTraditions();
  const { languages, loading: languagesLoading } = useLanguages();
  const { regions, loading: regionsLoading } = useRegions();
  const { categories, loading: categoriesLoading } = useCategories();
  const { informateurs, loading: informateursLoading } = useInformateurs();
  const { statistics: usersStats, loading: usersLoading } = useUsers();

  const isLoading = traditionsLoading || languagesLoading || regionsLoading || categoriesLoading || informateursLoading || usersLoading;

  const stats = [
    {
      title: "Total Traditions",
      value: isLoading ? "..." : traditionsMeta.total.toLocaleString(),
      icon: BookOpen,
      variant: "primary" as const,
    },
    {
      title: "Langues documentées",
      value: isLoading ? "..." : languages.length.toString(),
      icon: Languages,
      variant: "secondary" as const,
    },
    {
      title: "Régions couvertes",
      value: isLoading ? "..." : regions.length.toString(),
      icon: MapPin,
      variant: "default" as const,
    },
    {
      title: "Catégories",
      value: isLoading ? "..." : categories.length.toString(),
      icon: FolderOpen,
      variant: "primary" as const,
    },
    {
      title: "Informateurs",
      value: isLoading ? "..." : informateurs.length.toString(),
      icon: Mic,
      variant: "secondary" as const,
    },
    {
      title: "Total Utilisateurs",
      value: isLoading ? "..." : (usersStats?.totalUsers ?? 0).toLocaleString(),
      icon: Users,
      variant: "default" as const,
    },
    {
      title: "Nouveaux ce mois",
      value: isLoading ? "..." : (usersStats?.totalMonthUser ?? 0).toLocaleString(),
      icon: UserPlus,
      variant: "primary" as const,
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="Vue d'ensemble de la plateforme WHENUSU"
      />

      <div className="p-8 space-y-8">
        {/* Greeting */}
        {isAuth && fullName && (
          <div className="text-lg">
            Bonjour, <span className="font-semibold">{fullName}</span> 👋
          </div>
        )}

        {/* Time Filter */}
        <div className="flex justify-end">
          <TimeFilter />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ConsultationsChart />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
