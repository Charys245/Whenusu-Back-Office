import { Calendar, MapPin } from "lucide-react";
import { useIsAuthenticated, useUserFullName } from "@/hooks/useAuth";

interface HeroBannerProps {
  totalTraditions: number;
  pendingCount: number;
  totalUsers: number;
  isLoading?: boolean;
}

const HeroBanner = ({
  totalTraditions,
  pendingCount,
  totalUsers,
  isLoading = false,
}: HeroBannerProps) => {
  const isAuth = useIsAuthenticated();
  const fullName = useUserFullName();

  // Date actuelle formatée
  const now = new Date();
  const formattedDate = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#C6922E]/15 via-transparent to-transparent border border-[#E5DDD3] dark:border-[#3A3027] bg-white dark:bg-[#242019] animate-fade-up">
      {/* Motif géométrique africain stylisé en background (opacity 5%) */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none mix-blend-multiply dark:mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="africanPattern"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 0 L 30 15 L 60 0 L 60 15 L 30 30 L 60 45 L 60 60 L 30 45 L 0 60 L 0 45 L 30 30 L 0 15 Z"
                fill="none"
                stroke="#C6922E"
                strokeWidth="2"
              />
              <circle cx="30" cy="30" r="5" fill="#C6922E" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#africanPattern)" />
        </svg>
      </div>

      <div className="relative px-6 py-8 sm:p-10 flex flex-col justify-between min-h-70 lg:min-h-80 z-10">
        {/* Header d'accueil */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">👋</span>
            <p className="text-sm font-semibold text-[#C6922E] dark:text-[#D4A43A] uppercase tracking-wider">
              Session Active
            </p>
          </div>

          {isAuth && fullName && (
            <div className="text-lg">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2E1F] dark:text-white tracking-tight leading-tight">
                Bonjour, <span className="font-semibold">{fullName}</span>
              </h1>
            </div>
          )}

          <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-xl">
            Bienvenue sur le centre névralgique de{" "}
            <span className="text-[#C6922E] font-semibold">WHENUSU</span>.
            Supervisez, validez et préservez l'héritage vivant de nos cultures.
          </p>
        </div>

        {/* Infos de connexion & Micro Stats inline */}
        <div className="mt-8 pt-6 border-t border-[#E5DDD3]/50 dark:border-[#3A3027]/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-[#C6922E]" />
              <span className="font-medium capitalize">
                {formattedDate}, {formattedTime}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={16} className="text-[#C6922E]" />
              <span>Connecté maintenant</span>
            </div>
          </div>

          {/* Mini cards inline */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/60 dark:bg-[#1A1512]/60 backdrop-blur px-4 py-2.5 rounded-2xl border border-[#E5DDD3] dark:border-[#3A3027] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#C6922E]/10 flex items-center justify-center text-[#C6922E]">
                🎭
              </div>
              <div>
                <span className="block text-sm font-bold">
                  {isLoading ? "..." : totalTraditions.toLocaleString()}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Traditions
                </span>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-[#1A1512]/60 backdrop-blur px-4 py-2.5 rounded-2xl border border-[#E5DDD3] dark:border-[#3A3027] flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-[#FF9800]/10 flex items-center justify-center text-[#FF9800] ${pendingCount > 0 ? "animate-pulse" : ""}`}>
                ⏳
              </div>
              <div>
                <span className="block text-sm font-bold">
                  {isLoading ? "..." : pendingCount}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                  En attente
                </span>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-[#1A1512]/60 backdrop-blur px-4 py-2.5 rounded-2xl border border-[#E5DDD3] dark:border-[#3A3027] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#4CAF50]/10 flex items-center justify-center text-[#4CAF50]">
                👥
              </div>
              <div>
                <span className="block text-sm font-bold">
                  {isLoading ? "..." : totalUsers.toLocaleString()}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Membres
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
