import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Archive,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTraditions } from "@/hooks/useTraditions";
import { useCategories } from "@/hooks/useCategories";
import { useRegions } from "@/hooks/useRegions";
import { useLanguages } from "@/hooks/useLanguages";
import { formatDate } from "@/utils/dateUtils";
import type { Tradition, TraditionStatus, TraditionsFilterParams } from "@/types/tradition";
import { ViewTraditionModal } from "@/components/traditions/ViewTraditionModal";
import { CreateTraditionModal } from "@/components/traditions/CreateTraditionModal";
import { EditTraditionModal } from "@/components/traditions/EditTraditionModal";
import { DeleteTraditionDialog } from "@/components/traditions/DeleteTraditionDialog";

const statusConfig: Record<TraditionStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "En attente", variant: "secondary" },
  validate: { label: "Validée", variant: "default" },
  rejected: { label: "Rejetée", variant: "destructive" },
  archived: { label: "Archivée", variant: "outline" },
};

export default function Traditions() {
  // Filtres
  const [filters, setFilters] = useState<TraditionsFilterParams>({
    page: 1,
  });
  const [searchInput, setSearchInput] = useState("");

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTradition, setSelectedTradition] = useState<Tradition | null>(null);

  // Data
  const {
    traditions,
    meta,
    loading,
    isCreating,
    isUpdating,
    isDeleting,
    createTradition,
    updateTradition,
    deleteTradition,
    validateTradition,
    rejectTradition,
    archiveTradition,
    validateTraditionMutation,
    rejectTraditionMutation,
    archiveTraditionMutation,
  } = useTraditions(filters);

  const { categories } = useCategories();
  const { regions } = useRegions();
  const { languages } = useLanguages();

  // Helpers pour lookup des noms par ID (au cas où l'API ne renvoie pas les relations)
  const getCategoryName = (tradition: Tradition) => {
    if (tradition.category?.name) return tradition.category.name;
    if (!tradition.categoryId) return "-";
    const cat = categories.find((c) => c.id === tradition.categoryId);
    return cat?.name || "-";
  };

  const getRegionName = (tradition: Tradition) => {
    if (tradition.region?.name) return tradition.region.name;
    if (!tradition.regionId) return "-";
    const region = regions.find((r) => r.id === tradition.regionId);
    return region?.name || "-";
  };

  const getLanguageName = (tradition: Tradition) => {
    if (tradition.language?.name) return tradition.language.name;
    if (!tradition.languageId) return "-";
    const lang = languages.find((l) => l.id === tradition.languageId);
    return lang?.name || "-";
  };

  // Handlers
  const handleSearch = () => {
    setFilters({ ...filters, title: searchInput, page: 1 });
  };

  const handleFilterChange = (key: keyof TraditionsFilterParams, value: string) => {
    // "all" est utilisé comme valeur spéciale pour réinitialiser le filtre
    setFilters({ ...filters, [key]: value === "all" ? undefined : value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleView = (tradition: Tradition) => {
    setSelectedTradition(tradition);
    setViewModalOpen(true);
  };

  const handleEdit = (tradition: Tradition) => {
    setSelectedTradition(tradition);
    setEditModalOpen(true);
  };

  const handleDelete = (tradition: Tradition) => {
    setSelectedTradition(tradition);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTradition) {
      await deleteTradition(selectedTradition.id);
      setDeleteDialogOpen(false);
    }
  };

  const totalPages = Math.ceil(meta.total / meta.perPage);

  return (
    <div>
      <AdminHeader
        title="Traditions"
        subtitle="Gérer les traditions culturelles"
      />

      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Liste des traditions</h2>
            <p className="text-sm text-muted-foreground">
              {meta.total} tradition(s) au total
            </p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>

          <Select
            value={filters.category_id || "all"}
            onValueChange={(value) => handleFilterChange("category_id", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.region_id || "all"}
            onValueChange={(value) => handleFilterChange("region_id", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.language_id || "all"}
            onValueChange={(value) => handleFilterChange("language_id", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleSearch}>
            Filtrer
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Région</TableHead>
                <TableHead>Langue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Favoris</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : traditions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    Aucune tradition trouvée
                  </TableCell>
                </TableRow>
              ) : (
                traditions.map((tradition) => {
                  const status = statusConfig[tradition.status];
                  return (
                    <TableRow key={tradition.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {tradition.coverImg && (
                            <img
                              src={tradition.coverImg}
                              alt=""
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <span className="font-medium">{tradition.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryName(tradition)}
                      </TableCell>
                      <TableCell>
                        {getRegionName(tradition)}
                      </TableCell>
                      <TableCell>
                        {getLanguageName(tradition)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>{tradition.favorisCount}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {tradition.createdAt ? formatDate(tradition.createdAt) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(tradition)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(tradition)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {tradition.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => validateTradition(tradition.id)}
                                  disabled={validateTraditionMutation.isPending}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                  Valider
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => rejectTradition(tradition.id)}
                                  disabled={rejectTraditionMutation.isPending}
                                >
                                  <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                  Rejeter
                                </DropdownMenuItem>
                              </>
                            )}
                            {tradition.status !== "archived" && (
                              <DropdownMenuItem
                                onClick={() => archiveTradition(tradition.id)}
                                disabled={archiveTraditionMutation.isPending}
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                Archiver
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(tradition)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {meta.currentPage} sur {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.currentPage - 1)}
                disabled={meta.currentPage <= 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.currentPage + 1)}
                disabled={meta.currentPage >= totalPages || loading}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTraditionModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={createTradition}
        loading={isCreating}
      />

      <ViewTraditionModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        tradition={selectedTradition}
      />

      <EditTraditionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        tradition={selectedTradition}
        onSubmit={updateTradition}
        loading={isUpdating}
      />

      <DeleteTraditionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        tradition={selectedTradition}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}
