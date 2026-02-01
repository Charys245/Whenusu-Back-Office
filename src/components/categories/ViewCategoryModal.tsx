import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/utils/dateUtils";
import type { Category } from "@/types/category";

interface ViewCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export const ViewCategoryModal = ({
  open,
  onOpenChange,
  category,
}: ViewCategoryModalProps) => {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de la catégorie</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nom</p>
            <p className="text-base font-semibold">{category.name}</p>
          </div>

          {category.slug && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Slug</p>
              <p className="text-base">{category.slug}</p>
            </div>
          )}

          {category.created_at && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Date de création
              </p>
              <p className="text-base">{formatDateTime(category.created_at)}</p>
            </div>
          )}

          {category.updated_at && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Dernière modification
              </p>
              <p className="text-base">{formatDateTime(category.updated_at)}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
