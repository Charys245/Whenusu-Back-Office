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
import { Loader2 } from "lucide-react";
import type { Tradition } from "@/types/tradition";

interface DeleteTraditionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tradition: Tradition | null;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export const DeleteTraditionDialog = ({
  open,
  onOpenChange,
  tradition,
  onConfirm,
  loading = false,
}: DeleteTraditionDialogProps) => {
  if (!tradition) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer cette tradition ?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous êtes sur le point de supprimer la tradition{" "}
            <strong>"{tradition.title}"</strong>. Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault();
              await onConfirm();
            }}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
