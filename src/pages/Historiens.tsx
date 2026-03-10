import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Loader2,
  Play,
  FileText,
  User,
  MapPin,
  Languages,
} from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { useTraditions } from "@/hooks/useTraditions";
import { formatDate } from "@/utils/dateUtils";
import type { Tradition, TraditionStatus } from "@/types/tradition";

type ValidationStatus = "validated" | "rejected" | "to_verify";

const statusConfig: Record<
  TraditionStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "En attente", variant: "secondary" },
  validate: { label: "Validée", variant: "default" },
  rejected: { label: "Rejetée", variant: "destructive" },
  archived: { label: "Archivée", variant: "outline" },
};

export default function Historiens() {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTradition, setSelectedTradition] = useState<Tradition | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [avisScientifique, setAvisScientifique] = useState("");
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    traditions,
    loading,
    validateTradition,
    rejectTradition,
    validateTraditionMutation,
    rejectTraditionMutation,
  } = useTraditions(
    activeTab === "pending" ? { status: "pending" as TraditionStatus } : {}
  );

  // Filtrer par recherche
  const filteredTraditions = traditions.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = traditions.filter((t) => t.status === "pending").length;

  const handleReview = (tradition: Tradition) => {
    setSelectedTradition(tradition);
    setAvisScientifique("");
    setValidationStatus("");
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedTradition || !validationStatus) return;

    setIsSubmitting(true);
    try {
      if (validationStatus === "validated") {
        await validateTradition(selectedTradition.id);
      } else if (validationStatus === "rejected") {
        await rejectTradition(selectedTradition.id);
      }
      // Pour "to_verify", on pourrait envoyer un commentaire via une API dédiée
      // Pour l'instant, on ferme juste le modal
      setReviewModalOpen(false);
      setSelectedTradition(null);
    } catch {
      // Erreur gérée dans le hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Tradition>[] = [
    {
      key: "title",
      header: "Tradition",
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.coverImg && (
            <img
              src={item.coverImg}
              alt=""
              className="h-10 w-10 rounded object-cover"
            />
          )}
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">
              {item.category?.name || "-"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "informant",
      header: "Informateur",
      render: (item) => (
        <span className="text-sm">{item.informant?.name || "-"}</span>
      ),
    },
    {
      key: "region",
      header: "Région",
      render: (item) => (
        <span className="text-sm">{item.region?.name || "-"}</span>
      ),
    },
    {
      key: "language",
      header: "Langue",
      render: (item) => (
        <span className="text-sm">{item.language?.name || "-"}</span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (item) => {
        const status = statusConfig[item.status];
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      key: "createdAt",
      header: "Date",
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {item.createdAt ? formatDate(item.createdAt) : "-"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Validation Historique"
        subtitle="Valider scientifiquement les traditions soumises"
      />

      <div className="p-8 space-y-6">
        <PageHeader
          title="Traditions en attente"
          subtitle={`${pendingCount} tradition(s) à valider`}
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

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "all")}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              <Clock className="mr-2 h-4 w-4" />
              En attente ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="all">Toutes</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Chargement...</span>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredTraditions}
                onView={handleReview}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de validation scientifique */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Validation scientifique</DialogTitle>
            <DialogDescription>
              Examinez le contenu et donnez votre avis scientifique
            </DialogDescription>
          </DialogHeader>

          {selectedTradition && (
            <div className="space-y-6">
              {/* Informations de la tradition */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Titre</p>
                  <p className="font-semibold">{selectedTradition.title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
                  <p>{selectedTradition.category?.name || "-"}</p>
                </div>
              </div>

              {/* Média */}
              {selectedTradition.mediaUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Média (Audio/Vidéo)
                  </p>
                  <div className="bg-muted rounded-lg p-4">
                    <audio controls className="w-full" src={selectedTradition.mediaUrl}>
                      <track kind="captions" />
                      Votre navigateur ne supporte pas l'audio.
                    </audio>
                  </div>
                </div>
              )}

              {/* Transcription */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Transcription
                </p>
                <div className="bg-muted rounded-lg p-4 max-h-40 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedTradition.transcription || "Aucune transcription disponible"}
                  </p>
                </div>
              </div>

              {/* Informateur */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Informateur</p>
                    <p className="text-sm font-medium">
                      {selectedTradition.informant?.name || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Région</p>
                    <p className="text-sm font-medium">
                      {selectedTradition.region?.name || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Langue</p>
                    <p className="text-sm font-medium">
                      {selectedTradition.language?.name || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulaire d'avis */}
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="avis">Avis scientifique</Label>
                  <Textarea
                    id="avis"
                    placeholder="Rédigez votre avis scientifique sur cette tradition..."
                    value={avisScientifique}
                    onChange={(e) => setAvisScientifique(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Statut de validation</Label>
                  <Select
                    value={validationStatus}
                    onValueChange={(v) => setValidationStatus(v as ValidationStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un statut..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="validated">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Validé
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          Refusé
                        </div>
                      </SelectItem>
                      <SelectItem value="to_verify">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          À vérifier
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setReviewModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={
                    !validationStatus ||
                    isSubmitting ||
                    validateTraditionMutation.isPending ||
                    rejectTraditionMutation.isPending
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validation...
                    </>
                  ) : (
                    "Soumettre l'avis"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
