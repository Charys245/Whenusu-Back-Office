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
import type { Informateur } from "@/types/informateur";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  informateur: Informateur | null;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  informateur,
  onConfirm,
  loading,
}: DeleteConfirmDialogProps) => {
  if (!informateur) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Vous êtes sur le point de supprimer l'informateur{" "}
              <span className="font-semibold text-foreground">
                {informateur.name}
              </span>
              .
            </p>
            <p className="text-destructive font-medium">
              ⚠️ Attention : Si cet informateur a des traditions associées, la
              suppression pourrait échouer.
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
