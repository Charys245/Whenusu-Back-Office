import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Category } from "@/types/category";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  category,
  onConfirm,
  loading,
}: DeleteConfirmDialogProps) => {
  if (!category) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Vous êtes sur le point de supprimer la catégorie{" "}
              <span className="font-semibold text-foreground">
                {category.name}
              </span>
              .
            </p>
            <p className="text-destructive font-medium">
              ⚠️ Attention : Si cette catégorie a des traditions associées, la
              suppression échouera.
            </p>
            <p>Cette action est irréversible.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
