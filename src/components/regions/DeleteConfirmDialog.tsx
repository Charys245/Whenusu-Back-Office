// @/components/regions/DeleteConfirmDialog.tsx
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
import type { Language } from "@/types/language";
// import type { Region } from "@/types/region";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language | null
  // region: Region | null;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  // region,
  onConfirm,
  loading,
}: DeleteConfirmDialogProps) => {
  // if (!region) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Vous êtes sur le point de supprimer la région{" "}
              <span className="font-semibold text-foreground">
                {/* {region.name} */}
              </span>
              .
            </p>
            <p className="text-destructive font-medium">
              ⚠️ Attention : Si cette région a des langues ou traditions
              associées, la suppression échouera.
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
