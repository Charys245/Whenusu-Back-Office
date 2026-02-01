import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import type { Informateur, UpdateInformateurPayload } from "@/types/informateur";

interface EditInformateurModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  informateur: Informateur | null;
  onSubmit: (
    id: string,
    payload: UpdateInformateurPayload
  ) => Promise<Informateur>;
  loading: boolean;
}

export const EditInformateurModal = ({
  open,
  onOpenChange,
  informateur,
  onSubmit,
  loading,
}: EditInformateurModalProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    phoneNumber: string;
  }>({
    name: "",
    phoneNumber: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (informateur) {
      setFormData({
        name: informateur.name,
        phoneNumber: informateur.phoneNumber,
      });
      setAvatarPreview(informateur.avatarUrl);
      setAvatarFile(null);
    }
  }, [informateur]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation du format
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Le format de la photo doit être jpg, jpeg, png ou webp.");
        return;
      }

      // Validation de la taille (10 Mo max)
      if (file.size > 10 * 1024 * 1024) {
        alert("La taille de la photo ne doit pas dépasser 10 Mo.");
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(informateur?.avatarUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!informateur?.id) return;

    try {
      const payload: UpdateInformateurPayload = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
      };

      if (avatarFile) {
        payload.avatar_url = avatarFile;
      }

      await onSubmit(informateur.id, payload);
      onOpenChange(false);
    } catch {
      // L'erreur est déjà gérée dans le hook avec toast
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!informateur) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'informateur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar upload */}
          <div className="space-y-2">
            <Label>Photo de profil</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt={formData.name} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(formData.name || "?")}
                </AvatarFallback>
              </Avatar>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Changer
                </Button>
                {avatarFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, JPEG, PNG ou WebP. Max 10 Mo.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">Nom *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nom de l'informateur"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Numéro de téléphone *</Label>
            <Input
              id="edit-phone"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="Numéro de téléphone"
              required
              minLength={8}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 8 caractères
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
