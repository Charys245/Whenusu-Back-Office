import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, Image, Music } from "lucide-react";
import { useLanguages } from "@/hooks/useLanguages";
import { useRegions } from "@/hooks/useRegions";
import { useCategories } from "@/hooks/useCategories";
import { useInformateurs } from "@/hooks/useInformateurs";
import type { Tradition, UpdateTraditionPayload } from "@/types/tradition";

interface EditTraditionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tradition: Tradition | null;
  onSubmit: (id: string, payload: UpdateTraditionPayload) => Promise<unknown>;
  loading?: boolean;
}

export const EditTraditionModal = ({
  open,
  onOpenChange,
  tradition,
  onSubmit,
  loading = false,
}: EditTraditionModalProps) => {
  const { languages } = useLanguages();
  const { regions } = useRegions();
  const { categories } = useCategories();
  const { informateurs } = useInformateurs();

  const coverInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    transcription: "",
    language_id: "",
    region_id: "",
    category_id: "",
    informant_id: "",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Remplir le formulaire quand la tradition change
  useEffect(() => {
    if (tradition) {
      setFormData({
        title: tradition.title || "",
        transcription: tradition.transcription || "",
        language_id: tradition.languageId || "",
        region_id: tradition.regionId || "",
        category_id: tradition.categoryId || "",
        informant_id: tradition.informantId || "",
      });
      setCoverPreview(tradition.coverImg || null);
      setCoverFile(null);
      setMediaFile(null);
    }
  }, [tradition]);

  if (!tradition) return null;

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UpdateTraditionPayload = {};

    // Ajouter seulement les champs modifiés
    if (formData.title !== tradition.title) payload.title = formData.title;
    if (formData.transcription !== tradition.transcription) payload.transcription = formData.transcription;
    if (formData.language_id !== tradition.languageId) payload.language_id = formData.language_id;
    if (formData.region_id !== tradition.regionId) payload.region_id = formData.region_id;
    if (formData.category_id !== tradition.categoryId) payload.category_id = formData.category_id;
    if (formData.informant_id !== tradition.informantId) payload.informant_id = formData.informant_id;
    if (coverFile) payload.cover_img = coverFile;
    if (mediaFile) payload.media_url = mediaFile;

    await onSubmit(tradition.id, payload);
    onOpenChange(false);
  };

  const isValid = formData.title && formData.transcription;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la tradition</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la tradition
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Titre *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Titre de la tradition"
              required
              disabled={loading}
            />
          </div>

          {/* Transcription */}
          <div className="space-y-2">
            <Label htmlFor="edit-transcription">Transcription *</Label>
            <Textarea
              id="edit-transcription"
              value={formData.transcription}
              onChange={(e) =>
                setFormData({ ...formData, transcription: e.target.value })
              }
              placeholder="Texte de la tradition..."
              rows={4}
              required
              disabled={loading}
            />
          </div>

          {/* Selects */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, category_id: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Région</Label>
              <Select
                value={formData.region_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, region_id: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Langue</Label>
              <Select
                value={formData.language_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, language_id: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Informateur</Label>
              <Select
                value={formData.informant_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, informant_id: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {informateurs.map((info) => (
                    <SelectItem key={info.id} value={info.id}>
                      {info.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Upload fichiers */}
          <div className="grid grid-cols-2 gap-4">
            {/* Image de couverture */}
            <div className="space-y-2">
              <Label>Image de couverture</Label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleCoverChange}
                className="hidden"
              />
              <div
                onClick={() => coverInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
              >
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Image className="h-8 w-8 mb-2" />
                    <span className="text-sm">Cliquer pour modifier</span>
                    <span className="text-xs">JPG, PNG, WebP (max 10MB)</span>
                  </div>
                )}
              </div>
              {coverFile && (
                <p className="text-xs text-muted-foreground">
                  Nouveau fichier : {coverFile.name}
                </p>
              )}
            </div>

            {/* Média audio/vidéo */}
            <div className="space-y-2">
              <Label>Média audio/vidéo</Label>
              <input
                ref={mediaInputRef}
                type="file"
                accept="audio/mpeg,audio/wav,audio/m4a,video/mp4,video/quicktime"
                onChange={handleMediaChange}
                className="hidden"
              />
              <div
                onClick={() => mediaInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  {mediaFile ? (
                    <>
                      <Music className="h-8 w-8 mb-2 text-primary" />
                      <span className="text-sm text-primary font-medium">
                        {mediaFile.name}
                      </span>
                      <span className="text-xs">
                        {(mediaFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </>
                  ) : tradition.mediaUrl ? (
                    <>
                      <Music className="h-8 w-8 mb-2 text-green-600" />
                      <span className="text-sm text-green-600">Média existant</span>
                      <span className="text-xs">Cliquer pour remplacer</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-sm">Cliquer pour ajouter</span>
                      <span className="text-xs">MP3, WAV, MP4, MOV (max 80MB)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={!isValid || loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Modification...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
