import { BookOpen, Users, MapPin, Languages } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const activities = [
  {
    id: 1,
    type: "tradition",
    title: "Nouvelle tradition ajoutée",
    description: "La danse Ekonting a été ajoutée par Admin",
    time: "Il y a 2 heures",
    icon: BookOpen,
  },
  {
    id: 2,
    type: "user",
    title: "Nouvel informateur inscrit",
    description: "Mamadou Diallo s'est inscrit",
    time: "Il y a 4 heures",
    icon: Users,
  },
  {
    id: 3,
    type: "region",
    title: "Région mise à jour",
    description: "Informations de la région Casamance mises à jour",
    time: "Il y a 6 heures",
    icon: MapPin,
  },
  {
    id: 4,
    type: "language",
    title: "Nouvelle langue ajoutée",
    description: "Diola a été ajoutée au système",
    time: "Hier",
    icon: Languages,
  },
];

export function RecentActivity() {
  return (
    <div className="stat-card">
      <h3 className="mb-4 text-lg font-semibold">Activité récente</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <activity.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default RecentActivity;