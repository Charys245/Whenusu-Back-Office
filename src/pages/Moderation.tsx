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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Play,
  FileText,
  User,
  MapPin,
  Languages,
  Send,
  GraduationCap,
  Crown,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { useTraditions } from "@/hooks/useTraditions";
import { formatDate } from "@/utils/dateUtils";
import type { Tradition, TraditionStatus } from "@/types/tradition";

const statusConfig: Record<
  TraditionStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "En attente", variant: "secondary" },
  validate: { label: "Publiée", variant: "default" },
  rejected: { label: "Rejetée", variant: "destructive" },
  archived: { label: "Archivée", variant: "outline" },
};

export default function Moderation() {
  const [activeTab, setActiveTab] = useState<"pending" | "validate" | "rejected" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTradition, setSelectedTradition] = useState<Tradition | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [motifRejet, setMotifRejet] = useState("");
  const [demandeModification, setDemandeModification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState<"publish" | "reject" | "request_change" | null>(null);

  // Récupérer les traditions selon l'onglet actif
  const getFilterParams = () => {
    if (activeTab === "all") return {};
    return { status: activeTab as TraditionStatus };
  };

  const {
    traditions,
    loading,
    validateTradition,
    rejectTradition,
    validateTraditionMutation,
    rejectTraditionMutation,
  } = useTraditions(getFilterParams());

  // Filtrer par recherche
  const filteredTraditions = traditions.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = traditions.filter((t) => t.status === "pending").length;

  const handleReview = (tradition: Tradition) => {
    setSelectedTradition(tradition);
    setMotifRejet("");
    setDemandeModification("");
    setActionType(null);
    setReviewModalOpen(true);
  };

  const handlePublish = async () => {
    if (!selectedTradition) return;
    setIsSubmitting(true);
    try {
      await validateTradition(selectedTradition.id);
      setReviewModalOpen(false);
      setSelectedTradition(null);
    } catch {
      // Erreur gérée dans le hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTradition) return;
    setIsSubmitting(true);
    try {
      await rejectTradition(selectedTradition.id);
      setReviewModalOpen(false);
      setSelectedTradition(null);
    } catch {
      // Erreur gérée dans le hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChange = async () => {
    if (!selectedTradition || !demandeModification.trim()) return;
    setIsSubmitting(true);
    try {
      // TODO: Implémenter l'API pour demander une modification
      // Pour l'instant, on simule juste la fermeture
      console.log("Demande de modification:", demandeModification);
      setReviewModalOpen(false);
      setSelectedTradition(null);
    } catch {
      // Erreur gérée
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
        title="Modération"
        subtitle="Validation finale avant publication"
      />

      <div className="p-8 space-y-6">
        <PageHeader
          title="File de modération"
          subtitle={`${pendingCount} contenu(s) en attente de validation`}
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

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              <Clock className="mr-2 h-4 w-4" />
              En attente ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="validate">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Publiées
            </TabsTrigger>
            <TabsTrigger value="rejected">
              <XCircle className="mr-2 h-4 w-4" />
              Rejetées
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

      {/* Modal de modération */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modération du contenu</DialogTitle>
            <DialogDescription>
              Examinez le contenu et les avis des experts avant de prendre une décision
            </DialogDescription>
          </DialogHeader>

          {selectedTradition && (
            <div className="space-y-6">
              {/* Informations de la tradition */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Titre</p>
                  <p className="font-semibold text-lg">{selectedTradition.title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
                  <p>{selectedTradition.category?.name || "-"}</p>
                </div>
              </div>

              {/* Média (Audio/Vidéo) */}
              {selectedTradition.mediaUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Contenu média
                  </p>
                  <div className="bg-muted rounded-lg p-4">
                    {selectedTradition.mediaUrl.includes(".mp4") ||
                    selectedTradition.mediaUrl.includes("video") ? (
                      <video
                        controls
                        className="w-full rounded max-h-64"
                        src={selectedTradition.mediaUrl}
                      >
                        <track kind="captions" />
                      </video>
                    ) : (
                      <audio controls className="w-full" src={selectedTradition.mediaUrl}>
                        <track kind="captions" />
                      </audio>
                    )}
                  </div>
                </div>
              )}

              {/* Transcription */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Transcription
                </p>
                <div className="bg-muted rounded-lg p-4 max-h-32 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedTradition.transcription || "Aucune transcription disponible"}
                  </p>
                </div>
              </div>

              {/* Informations contextuelles */}
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

              {/* Avis des experts */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Avis des experts
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  {/* Avis de l'historien */}
                  <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">Avis Historien</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {/* TODO: Afficher l'avis réel quand disponible dans l'API */}
                      <div className="flex items-center gap-2 text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>En attente de validation scientifique</span>
                      </div>
                    </div>
                  </div>

                  {/* Avis de l'expert tradition */}
                  <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-sm">Avis Expert Culturel</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {/* TODO: Afficher l'avis réel quand disponible dans l'API */}
                      <div className="flex items-center gap-2 text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>En attente de validation culturelle</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions de modération */}
              {selectedTradition.status === "pending" && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold">Actions de modération</h4>

                  {/* Sélection d'action */}
                  <div className="flex gap-3">
                    <Button
                      variant={actionType === "publish" ? "default" : "outline"}
                      className={actionType === "publish" ? "bg-green-600 hover:bg-green-700" : "text-green-600 hover:text-green-700"}
                      onClick={() => setActionType("publish")}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Publier
                    </Button>
                    <Button
                      variant={actionType === "reject" ? "default" : "outline"}
                      className={actionType === "reject" ? "bg-red-600 hover:bg-red-700" : "text-red-600 hover:text-red-700"}
                      onClick={() => setActionType("reject")}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Rejeter
                    </Button>
                    <Button
                      variant={actionType === "request_change" ? "default" : "outline"}
                      className={actionType === "request_change" ? "bg-yellow-600 hover:bg-yellow-700" : "text-yellow-600 hover:text-yellow-700"}
                      onClick={() => setActionType("request_change")}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Demander modification
                    </Button>
                  </div>

                  {/* Formulaire selon l'action sélectionnée */}
                  {actionType === "reject" && (
                    <div className="space-y-2">
                      <Label htmlFor="motif">Motif du rejet</Label>
                      <Textarea
                        id="motif"
                        placeholder="Indiquez le motif du rejet..."
                        value={motifRejet}
                        onChange={(e) => setMotifRejet(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}

                  {actionType === "request_change" && (
                    <div className="space-y-2">
                      <Label htmlFor="modification">Modifications demandées</Label>
                      <Textarea
                        id="modification"
                        placeholder="Décrivez les modifications à apporter..."
                        value={demandeModification}
                        onChange={(e) => setDemandeModification(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Boutons de validation */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setReviewModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Fermer
                </Button>

                {selectedTradition.status === "pending" && actionType && (
                  <Button
                    onClick={() => {
                      if (actionType === "publish") handlePublish();
                      else if (actionType === "reject") handleReject();
                      else if (actionType === "request_change") handleRequestChange();
                    }}
                    disabled={
                      isSubmitting ||
                      validateTraditionMutation.isPending ||
                      rejectTraditionMutation.isPending ||
                      (actionType === "request_change" && !demandeModification.trim())
                    }
                    className={
                      actionType === "publish"
                        ? "bg-green-600 hover:bg-green-700"
                        : actionType === "reject"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement...
                      </>
                    ) : actionType === "publish" ? (
                      "Confirmer la publication"
                    ) : actionType === "reject" ? (
                      "Confirmer le rejet"
                    ) : (
                      "Envoyer la demande"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
