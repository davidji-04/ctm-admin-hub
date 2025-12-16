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
import { AlertCircle } from "lucide-react";

interface DeletePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  planName: string;
}

export const DeletePlanModal = ({
  open,
  onOpenChange,
  onConfirm,
  planName,
}: DeletePlanModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertDialogTitle>Eliminar Plano de Treino</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            Tem a certeza que deseja eliminar o plano <strong>"{planName}"</strong>?
            <br />
            <span className="text-xs text-muted-foreground mt-2 block">
              Esta ação não pode ser desfeita. O plano será removido permanentemente da lista de planos ativos.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};