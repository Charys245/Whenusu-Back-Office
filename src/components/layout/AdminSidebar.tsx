import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Languages,
  MapPin,
  UserCog,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Traditions", href: "/traditions", icon: BookOpen },
  { name: "Informateurs", href: "/informateurs", icon: Users },
  { name: "Langues", href: "/langues", icon: Languages },
  { name: "Régions", href: "/regions", icon: MapPin },
  { name: "Utilisateurs", href: "/users", icon: UserCog },
  { name: "Modération", href: "/moderation", icon: Shield },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center justify-center border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">
                W
              </span>
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">
              WHENUSU
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "sidebar-link",
                  isActive && "sidebar-link-active"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-4">
          <NavLink
            to="/login"
            className="sidebar-link text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
