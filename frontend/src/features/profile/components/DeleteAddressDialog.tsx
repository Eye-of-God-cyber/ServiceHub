import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteAddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteAddressDialog({ isOpen, onClose, onConfirm, isDeleting }: DeleteAddressDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex items-center justify-between shrink-0">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-destructive w-5 h-5" />
            Delete Address
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isDeleting}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this address? This action cannot be undone.
          </p>
        </div>
        
        <div className="p-6 border-t bg-muted/10 flex justify-end gap-3 mt-auto">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Address"}
          </Button>
        </div>
      </div>
    </div>
  );
}
