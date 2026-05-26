import { useState, useEffect } from "react";
import { Bell, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { useCurrentUser, useUserFullName, useUserInitials } from "@/hooks/useAuth";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const user = useCurrentUser();
  const fullName = useUserFullName();
  const initials = useUserInitials();

  // État du mode sombre avec persistance localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem("whenusu-dark-mode");
    if (stored !== null) {
      return stored === "true";
    }
    // Détecter la préférence système par défaut
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Synchroniser le mode sombre avec le DOM
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("whenusu-dark-mode", String(darkMode));
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="w-64 pl-10 bg-background"
          />
        </div> */}

        {/* Toggle Mode Sombre */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-white dark:bg-[#242019] border border-[#E5DDD3] dark:border-[#3A3027] hover:border-[#C6922E] dark:hover:border-[#D4A43A] text-[#3D2E1F] dark:text-[#F9F7F5] transition-all shadow-sm cursor-pointer"
          aria-label="Changer le thème"
        >
          {darkMode ? (
            <Sun size={18} className="text-[#D4A43A]" />
          ) : (
            <Moon size={18} className="text-[#3D2E1F]" />
          )}
        </button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            3
          </span>
        </Button>

        {/* User Menu */}
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
          <Avatar className="h-8 w-8">
            {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={fullName} />}
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <p className="text-sm font-medium">{fullName || "Utilisateur"}</p>
            <p className="text-xs text-muted-foreground">Administrateur</p>
          </div>
        </div>
      </div>
    </header>
  );
}
