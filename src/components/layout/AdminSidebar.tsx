import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Languages,
  MapPin,
  UserCog,
  ShieldCheck,
  Shield,
  Settings,
  LogOut,
  FolderOpen,
  GraduationCap,
  Mic,
  Crown,
  // BarChart3,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import logoWhenusu from "@/assets/logoWhenusu.png";

// Types pour la navigation
interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles: string[]; // Rôles autorisés (vide = tous)
}

// Configuration des menus par rôle
// "all" signifie accessible à tous les rôles authentifiés
const ALL_ROLES = [
  "super-admin",
  "admin",
  "moderateur",
  "historien",
  "expert-tradition",
  "informant",
];

const navigation: NavItem[] = [
  // Dashboard - Tous les rôles
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ALL_ROLES,
  },

  // Gestion des contenus
  {
    name: "Catégories",
    href: "/categories",
    icon: FolderOpen,
    roles: ["super-admin", "admin"],
  },
  {
    name: "Traditions",
    href: "/traditions",
    icon: BookOpen,
    roles: [
      "super-admin",
      "admin",
      "moderateur",
      "historien",
      "expert-tradition",
      "informant",
    ],
  },

  // Gestion des utilisateurs par type
  {
    name: "Informateurs",
    href: "/informateurs",
    icon: Mic,
    roles: ["super-admin", "admin"],
  },
  {
    name: "Historiens",
    href: "/historiens",
    icon: GraduationCap,
    roles: ["super-admin", "admin"],
  },
  {
    name: "Experts tradition",
    href: "/experts",
    icon: Crown,
    roles: ["super-admin", "admin"],
  },

  // Données de référence
  {
    name: "Langues",
    href: "/langues",
    icon: Languages,
    roles: ["super-admin", "admin"],
  },
  {
    name: "Régions",
    href: "/regions",
    icon: MapPin,
    roles: ["super-admin", "admin"],
  },

  // Administration
  {
    name: "Utilisateurs",
    href: "/users",
    icon: UserCog,
    roles: ["super-admin", "admin"],
  },
  {
    name: "Rôles",
    href: "/roles",
    icon: ShieldCheck,
    roles: ["super-admin", "admin"],
  },
  // {
  //   name: "Permissions",
  //   href: "/permissions",
  //   icon: Key,
  //   roles: ["super-admin", "admin"],
  // },

  // Modération
  {
    name: "Modération",
    href: "/moderation",
    icon: Shield,
    roles: ["super-admin", "admin", "moderateur"],
  },

  // Statistiques
  // {
  //   name: "Statistiques",
  //   href: "/statistiques",
  //   icon: BarChart3,
  //   roles: ["super-admin", "admin"],
  // },

  // Paramètres système
  {
    name: "Paramètres",
    href: "/settings",
    icon: Settings,
    roles: ["super-admin"],
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout: logoutStore, getUserRoles } = useAuthStore();

  const userRoles = getUserRoles();

  // Filtrer les menus selon les rôles de l'utilisateur
  const filteredNavigation = navigation.filter((item) => {
    // Si pas de restriction de rôles, accessible à tous
    if (item.roles.length === 0) return true;
    // Vérifier si l'utilisateur a au moins un des rôles requis
    return item.roles.some((role) => userRoles.includes(role));
  });

  const handleLogout = async () => {
    try {
      await authService.logout();
      logoutStore();
      navigate("/se-connecter");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center justify-center border-b border-sidebar-border">
          <img
            src={logoWhenusu}
            alt="Whenusu"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {filteredNavigation.map((item) => {
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
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
