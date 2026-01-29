import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/utils/dateUtils";
import type { Language } from "@/types/language";

interface ViewLanguageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language | null;
}

export const ViewLanguageModal = ({
  open,
  onOpenChange,
  language,
}: ViewLanguageModalProps) => {
  if (!language) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de la langue</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nom</p>
            <p className="text-base font-semibold">{language.name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Slug</p>
            <p className="text-base">{language.slug}</p>
          </div>

          {language.created_at && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Date de création
              </p>
              <p className="text-base">{formatDateTime(language.created_at)}</p>
            </div>
          )}

          {language.updated_at && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Dernière modification
              </p>
              <p className="text-base">{formatDateTime(language.updated_at)}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
