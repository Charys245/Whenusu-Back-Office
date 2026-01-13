import { AdminHeader } from "@/components/layout/AdminHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { TimeFilter } from "@/components/dashboard/TimeFilter";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { BookOpen, Languages, MapPin, Users } from "lucide-react";
import ConsultationsChart from "@/components/dashboard/ConsultationsChart";

const stats = [
  {
    title: "Total Traditions",
    value: "1,247",
    icon: BookOpen,
    trend: { value: 12, isPositive: true },
    variant: "primary" as const,
  },
  {
    title: "Langues documentées",
    value: "86",
    icon: Languages,
    trend: { value: 5, isPositive: true },
    variant: "secondary" as const,
  },
  {
    title: "Régions couvertes",
    value: "34",
    icon: MapPin,
    trend: { value: 8, isPositive: true },
    variant: "default" as const,
  },
  {
    title: "Utilisateurs actifs",
    value: "5,892",
    icon: Users,
    trend: { value: 23, isPositive: true },
    variant: "primary" as const,
  },
];

export default function Dashboard() {
  return (
    <div>
      <AdminHeader 
        title="Dashboard" 
        subtitle="Vue d'ensemble de la plateforme WHENUSU" 
      />
      
      <div className="p-8 space-y-8">
        {/* Time Filter */}
        <div className="flex justify-end">
          <TimeFilter />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
