import { AdminHeader } from "@/components/layout/AdminHeader";
import {
  BookOpen,
  Languages,
  MapPin,
  Users,
  
  Mic,
  UserPlus,
  Clock,
  Check,
  X,
  Search,
  Folder,
  Award,
  Activity,
  Info,
  Filter,
  AlertTriangle,
  Heart,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useTraditions } from "@/hooks/useTraditions";
import { useLanguages } from "@/hooks/useLanguages";
import { useRegions } from "@/hooks/useRegions";
import { useCategories } from "@/hooks/useCategories";
import { useInformateurs } from "@/hooks/useInformateurs";
import { useUsers } from "@/hooks/useUsers";
import { getMediaUrl } from "@/utils/helpers";
import { useNavigate } from "react-router-dom";
import HeroBanner from "@/components/dashboard/HeroBanner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";

// ==========================================
// TYPES TS
// ==========================================

export interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  iconBg: string;
  badgeText: string;
  badgeType: "success" | "warning" | "info";
  delay: string;
}

export interface MiniStatProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Récupérer les données dynamiques
  const {
    meta: traditionsMeta,
    popularTraditions,
    loading: traditionsLoading,
  } = useTraditions();
  const {
    traditions: pendingTraditions,
    loading: pendingLoading,
    validateTradition,
    rejectTradition,
  } = useTraditions({ status: "pending" });
  const { languages, loading: languagesLoading } = useLanguages();
  const { regions, loading: regionsLoading } = useRegions();
  const { categories, loading: categoriesLoading } = useCategories();
  const { informateurs, loading: informateursLoading } = useInformateurs();
  const { statistics: usersStats, loading: usersLoading } = useUsers();

  const isLoading =
    traditionsLoading ||
    pendingLoading ||
    languagesLoading ||
    regionsLoading ||
    categoriesLoading ||
    informateursLoading ||
    usersLoading;

  // TODO: Remplacer par les vraies données de l'API quand disponible
  const chartData = [
    {
      name: "Lun",
      consultations:
        traditionsMeta.total > 0 ? Math.floor(traditionsMeta.total * 0.8) : 0,
    },
    {
      name: "Mar",
      consultations:
        traditionsMeta.total > 0 ? Math.floor(traditionsMeta.total * 1.2) : 0,
    },
    {
      name: "Mer",
      consultations:
        traditionsMeta.total > 0 ? Math.floor(traditionsMeta.total * 1.5) : 0,
    },
    {
      name: "Jeu",
      consultations:
        traditionsMeta.total > 0 ? Math.floor(traditionsMeta.total * 1.1) : 0,
    },
    {
      name: "Ven",
      consultations:
        traditionsMeta.total > 0 ? Math.floor(traditionsMeta.total * 1.8) : 0,
    },
    {
      name: "Sam",
      consultations:
        traditionsMeta.total > 0 ? Math.floor(traditionsMeta.total * 2.0) : 0,
    },
    {
      name: "Dim",
      consultations:
        traditionsMeta.total > 0 ? Math.floor(traditionsMeta.total * 1.6) : 0,
    },
  ];

  const [darkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [selectedTradition, setSelectedTradition] = useState<
    import("@/types/tradition").Tradition | null
  >(null);

  // Liste des catégories uniques pour filtrage
  const filterCategoryOptions = useMemo(() => {
    return [
      "Tous",
      ...Array.from(
        new Set(
          pendingTraditions.map((item) => item.category?.name).filter(Boolean)
        )
      ),
    ];
  }, [pendingTraditions]);

  // Filtrage des traditions en attente
  const filteredTraditions = useMemo(() => {
    return pendingTraditions.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.region?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (item.informant?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === "Tous" || item.category?.name === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [pendingTraditions, searchQuery, selectedCategory]);

  // Actions d'administration avec l'API
  const handleApprove = async (id: string) => {
    await validateTradition(id);
    setSelectedTradition(null);
  };

  const handleReject = async (id: string) => {
    await rejectTradition(id);
    setSelectedTradition(null);
  };

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="Vue d'ensemble de la plateforme WHENUSU"
      />

      <div className="p-8 space-y-8">
        <HeroBanner
          totalTraditions={traditionsMeta.total}
          pendingCount={pendingTraditions.length}
          totalUsers={usersStats?.totalUsers ?? 0}
          isLoading={isLoading}
        />

        {/* =============================================================
            SECTION 1 : STATISTIQUES PRINCIPALES (4 GRANDES CARTES)
            ============================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatsCard
            title="Total Traditions"
            value={isLoading ? "..." : traditionsMeta.total.toLocaleString()}
            subtext="Transmises oralement"
            icon={<BookOpen size={22} />}
            iconBg="bg-[#C6922E]/10 text-[#C6922E]"
            badgeText="Base de données"
            badgeType="info"
            delay="delay-[100ms]"
          />

          <StatsCard
            title="En attente de validation"
            value={pendingTraditions.length}
            subtext="Nécessite votre relecture"
            icon={<Clock size={22} />}
            iconBg="bg-[#FF9800]/10 text-[#FF9800]"
            badgeText={pendingTraditions.length > 0 ? "Urgent" : "À jour"}
            badgeType={pendingTraditions.length > 0 ? "warning" : "success"}
            delay="delay-[200ms]"
          />

          <StatsCard
            title="Total Utilisateurs"
            value={
              isLoading ? "..." : (usersStats?.totalUsers ?? 0).toLocaleString()
            }
            subtext="Contributeurs & Lecteurs"
            icon={<Users size={22} />}
            iconBg="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            badgeText={`+${usersStats?.totalMonthUser ?? 0} ce mois`}
            badgeType="success"
            delay="delay-[300ms]"
          />

          <StatsCard
            title="Nouveaux ce mois"
            value={
              isLoading
                ? "..."
                : (usersStats?.totalMonthUser ?? 0).toLocaleString()
            }
            subtext="Inscriptions validées"
            icon={<UserPlus size={22} />}
            iconBg="bg-[#4CAF50]/10 text-[#4CAF50]"
            badgeText="Ce mois-ci"
            badgeType="success"
            delay="delay-[400ms]"
          />
        </section>

        {/* =============================================================
            SECTION 4 : STATISTIQUES SECONDAIRES (5 MINI CARTES COMPACTES)
            ============================================================= */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MiniStatCard
            title="Langues préservées"
            value={isLoading ? "..." : languages.length}
            icon={<Languages size={20} />}
            color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          />
          <MiniStatCard
            title="Régions géographiques"
            value={isLoading ? "..." : regions.length}
            icon={<MapPin size={20} />}
            color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
          <MiniStatCard
            title="Catégories d'archives"
            value={isLoading ? "..." : categories.length}
            icon={<Folder size={20} />}
            color="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
          />
          <MiniStatCard
            title="Informateurs & Gardiens"
            value={isLoading ? "..." : informateurs.length}
            icon={<Mic size={20} />}
            color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />
          <MiniStatCard
            title="Traditions validées"
            value={isLoading ? "..." : traditionsMeta.total}
            icon={<Award size={20} />}
            color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />
        </section>

        {/* =============================================================
            SECTION 2 : GRAPHIQUE & TOP TRADITIONS
            ============================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique des consultations */}
          <div className="lg:col-span-2 bg-white dark:bg-[#242019] rounded-3xl border border-[#E5DDD3] dark:border-[#3A3027] p-6  flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-semibold text-[#C6922E] dark:text-[#D4A43A] uppercase tracking-wider">
                  Fréquentation
                </span>
                <h3 className="text-lg font-bold">
                  Consultations de traditions
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Activité enregistrée sur les 7 derniers jours
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#F9F7F5] dark:bg-[#1A1512] px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E5DDD3] dark:border-[#3A3027]">
                <Activity size={14} className="text-[#C6922E]" />
                <span>+12.4% vs semaine dernière</span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorConsultations"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#C6922E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#C6922E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={darkMode ? "#3A3027" : "#E5DDD3"}
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: darkMode ? "#F9F7F5" : "#3D2E1F",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: darkMode ? "#F9F7F5" : "#3D2E1F",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                  <Area
                    type="monotone"
                    dataKey="consultations"
                    stroke="#C6922E"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorConsultations)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 traditions */}
          <div className="bg-white dark:bg-[#242019] rounded-3xl border border-[#E5DDD3] dark:border-[#3A3027] p-6  flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-semibold text-[#C6922E] dark:text-[#D4A43A] uppercase tracking-wider">
                    Performance
                  </span>
                  <h3 className="text-lg font-bold">Top 5 Traditions</h3>
                </div>
                <span className="p-2 rounded-xl bg-[#C6922E]/10 text-[#C6922E]">
                  <Award size={18} />
                </span>
              </div>

              <div className="space-y-4">
                {popularTraditions.length > 0 ? (
                  popularTraditions.slice(0, 5).map((item, index) => {
                    const maxFavoris = popularTraditions[0]?.favorisCount || 1;
                    const percentage = Math.round(
                      (item.favorisCount / maxFavoris) * 100
                    );
                    return (
                      <div
                        key={item.id}
                        className="group p-2 rounded-xl hover:bg-[#F9F7F5] dark:hover:bg-[#1A1512] transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          {/* Numéro & Image */}
                          <div className="relative shrink-0">
                            <img
                              src={
                                getMediaUrl(item.coverImg) || "/placeholder.jpg"
                              }
                              alt={item.title}
                              className="w-12 h-12 rounded-full object-cover border-2 border-[#C6922E]/80 group-hover:border-[#C6922E] transition-all"
                            />
                            <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#C6922E] text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white dark:border-[#242019]">
                              {index + 1}
                            </span>
                          </div>

                          {/* Titre & Progress */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-sm text-[#3D2E1F] dark:text-white truncate group-hover:text-[#C6922E] transition-colors">
                                {item.title}
                              </p>
                              <span className="text-xs font-bold shrink-0 flex items-center gap-1">
                                <Heart
                                  size={10}
                                  className="text-red-500 fill-red-500"
                                />
                                {item.favorisCount}
                              </span>
                            </div>

                            {/* Barre de progression stylisée */}
                            <div className="mt-2 w-full bg-[#E5DDD3] dark:bg-[#3A3027] h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-linear-to-r from-[#C6922E] to-[#FFB82B] h-full rounded-full transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-neutral-500 text-center py-4">
                    Aucune tradition populaire
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5DDD3]/50 dark:border-[#3A3027]/50 mt-4 text-center">
              <button
                onClick={() => navigate("/traditions")}
                className="text-xs font-bold text-[#C6922E] dark:text-[#D4A43A] hover:underline inline-flex items-center gap-1"
              >
                Consulter tous les classements
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* =============================================================
            SECTION 3 : TRADITIONS EN ATTENTE DE VALIDATION (TABLE MODERNE)
            ============================================================= */}
        <section className="bg-white dark:bg-[#242019] rounded-3xl border border-[#E5DDD3] dark:border-[#3A3027] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#C6922E] dark:text-[#D4A43A] uppercase tracking-wider">
                Modération
              </span>
              <h3 className="text-xl font-bold">
                Récits et traditions en attente
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Contrôlez les soumissions communautaires avant publication
                officielle.
              </p>
            </div>

            {/* Barre de recherche & Filtre */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une tradition, région..."
                  className="pl-9 pr-4 py-2 text-sm rounded-xl border border-[#E5DDD3] dark:border-[#3A3027] bg-[#F9F7F5] dark:bg-[#1A1512] focus:outline-none focus:border-[#C6922E] dark:focus:border-[#D4A43A] transition-all w-full sm:w-64"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm rounded-xl border border-[#E5DDD3] dark:border-[#3A3027] bg-[#F9F7F5] dark:bg-[#1A1512] focus:outline-none focus:border-[#C6922E] dark:focus:border-[#D4A43A] transition-all font-semibold cursor-pointer"
                >
                  {filterCategoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Filter
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E5DDD3]/50 dark:border-[#3A3027]/50">
            {filteredTraditions.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F9F7F5] dark:bg-[#1A1512] text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-[#E5DDD3] dark:border-[#3A3027]">
                    <th className="px-6 py-4">Tradition</th>
                    <th className="px-6 py-4">Région d'Origine</th>
                    <th className="px-6 py-4">Informant / Source</th>
                    <th className="px-6 py-4">Date de soumission</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DDD3]/30 dark:divide-[#3A3027]/30">
                  {filteredTraditions.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F9F7F5]/50 dark:hover:bg-[#1A1512]/20 transition-all duration-150 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              getMediaUrl(item.coverImg) || "/placeholder.jpg"
                            }
                            alt={item.title}
                            className="w-14 h-14 rounded-lg object-cover border border-[#E5DDD3] dark:border-[#3A3027] shrink-0"
                          />
                          <div>
                            <button
                              onClick={() => setSelectedTradition(item)}
                              className="font-bold text-sm text-[#3D2E1F] dark:text-white hover:text-[#C6922E] dark:hover:text-[#D4A43A] transition-colors text-left inline-flex items-center gap-1 group"
                            >
                              {item.title}
                              <ExternalLink
                                size={12}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </button>
                            <span className="block mt-1">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C6922E]/10 text-[#C6922E]">
                                {item.category?.name || "-"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                        {item.region?.name || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="font-semibold">
                          {item.informant?.name || "-"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-neutral-500">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("fr-FR")
                          : "-"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="p-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white transition-all"
                            title="Valider la tradition"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all"
                            title="Rejeter la soumission"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center space-y-3">
                <AlertTriangle className="mx-auto text-neutral-400" size={40} />
                <h4 className="text-base font-bold text-neutral-400">
                  Aucune tradition trouvée
                </h4>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Aucun élément ne correspond à votre filtre ou aucune
                  soumission n'est actuellement en attente pour cette catégorie.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =============================================================
            SECTION 5 : FLUX D'ACTIVITÉ RÉCENTE (TIMELINE)
            ============================================================= */}
        {/* <section className="bg-white dark:bg-[#242019] rounded-3xl border border-[#E5DDD3] dark:border-[#3A3027] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-semibold text-[#C6922E] dark:text-[#D4A43A] uppercase tracking-wider">
                Audit
              </span>
              <h3 className="text-lg font-bold">Flux d'activités récentes</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-400"></span>
              <span className="text-xs font-semibold text-neutral-500">
                En attente d'API
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
            <Activity size={40} className="mb-3" />
            <p className="text-sm font-medium">Aucune activité récente</p>
            <p className="text-xs">Les activités s'afficheront ici quand l'API sera disponible</p>
          </div>
        </section> */}

        {/* =============================================================
          MODAL DETAIL : SOUUMISSION EN ATTENTE
          ============================================================= */}
        {selectedTradition && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#242019] rounded-3xl border border-[#E5DDD3] dark:border-[#3A3027] max-w-2xl w-full overflow-hidden transform transition-all animate-fade-up">
              {/* Image de couverture en haut de la modal */}
              <div className="relative h-48 w-full">
                <img
                  src={
                    getMediaUrl(selectedTradition.coverImg) ||
                    "/placeholder.jpg"
                  }
                  alt={selectedTradition.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                <button
                  onClick={() => setSelectedTradition(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all"
                >
                  <X size={18} />
                </button>

                <div className="absolute bottom-4 left-6 right-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C6922E] text-white">
                    {selectedTradition.category?.name || "-"}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2 truncate">
                    {selectedTradition.title}
                  </h2>
                </div>
              </div>

              {/* Contenu textuel */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-medium text-neutral-500 border-b border-[#E5DDD3]/50 dark:border-[#3A3027]/50 pb-4">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#C6922E] tracking-wider">
                      Origine
                    </span>
                    <span className="text-sm font-bold text-[#3D2E1F] dark:text-white mt-1 block">
                      {selectedTradition.region?.name || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#C6922E] tracking-wider">
                      Gardien du savoir
                    </span>
                    <span className="text-sm font-bold text-[#3D2E1F] dark:text-white mt-1 block">
                      {selectedTradition.informant?.name || "-"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#C6922E] tracking-wider mb-2">
                    Transcription
                  </span>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium max-h-32 overflow-y-auto">
                    {selectedTradition.transcription}
                  </p>
                </div>

                {/* Note informative de validation */}
                <div className="bg-[#FF9800]/10 border border-[#FF9800]/20 rounded-2xl p-4 flex items-start gap-3">
                  <Info size={18} className="text-[#FF9800] shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    <span className="font-bold text-[#FF9800]">
                      Consignes d'administration :
                    </span>{" "}
                    Avant d'approuver cet élément, assurez-vous de la conformité
                    de l'orthographe locale et de l'exactitude historique de la
                    source citée.
                  </div>
                </div>

                {/* Actions de la modal */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5DDD3]/50 dark:border-[#3A3027]/50">
                  <button
                    onClick={() => setSelectedTradition(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F9F7F5] dark:bg-[#1A1512] border border-[#E5DDD3] dark:border-[#3A3027] hover:bg-[#EFEAE5] dark:hover:bg-[#2E2620] transition-all"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => handleReject(selectedTradition.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-1.5"
                  >
                    <X size={14} />
                    Rejeter
                  </button>
                  <button
                    onClick={() => handleApprove(selectedTradition.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C6922E] hover:bg-[#A6751F] text-white transition-all flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    Approuver la tradition
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  subtext,
  icon,
  iconBg,
  badgeText,
  badgeType,
  delay,
}: StatCardProps) {
  const badgeColors = {
    success:
      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    warning:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 animate-pulse",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  };

  return (
    <div
      className={`bg-white dark:bg-[#242019] rounded-3xl border border-[#E5DDD3] dark:border-[#3A3027] p-6 hover:scale-[1.02] transition-all duration-300 animate-fade-up ${delay}`}
    >
      <div className="flex justify-between items-start">
        {/* Titre & Chiffre */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            {title}
          </span>
          <p className="text-3xl font-extrabold text-[#3D2E1F] dark:text-white tracking-tight">
            {value}
          </p>
          <span className="block text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {subtext}
          </span>
        </div>

        {/* Icone */}
        <div className={`p-3 rounded-2xl ${iconBg} `}>{icon}</div>
      </div>

      {/* Badge de tendance */}
      <div className="mt-4 pt-4 border-t border-[#E5DDD3]/40 dark:border-[#3A3027]/40 flex items-center justify-between">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColors[badgeType]}`}
        >
          {badgeText}
        </span>
        <span className="text-[10px] text-neutral-400 font-semibold uppercase">
          Mise à jour
        </span>
      </div>
    </div>
  );
}

function MiniStatCard({ title, value, icon, color }: MiniStatProps) {
  return (
    <div className="bg-white dark:bg-[#242019] rounded-2xl border border-[#E5DDD3] dark:border-[#3A3027] p-4 flex items-center gap-4  hover:scale-[1.01] transition-all duration-300">
      <div className={`p-2.5 rounded-xl shrink-0 ${color}`}>{icon}</div>
      <div className="min-w-0">
        <span className="block text-xl font-extrabold text-[#3D2E1F] dark:text-white leading-none">
          {value}
        </span>
        <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wide truncate mt-1">
          {title}
        </span>
      </div>
    </div>
  );
}

// Composant Tooltip personnalisé pour Recharts
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#242019] border border-[#E5DDD3] dark:border-[#3A3027] px-4 py-3 rounded-2xl space-y-1">
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          {label}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C6922E]"></span>
          <span className="text-sm font-extrabold text-[#3D2E1F] dark:text-white">
            {payload[0].value} consultations
          </span>
        </div>
      </div>
    );
  }
  return null;
}
