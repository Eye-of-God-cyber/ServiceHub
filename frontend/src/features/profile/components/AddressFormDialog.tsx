import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Address } from "@/shared/types/address/domain.types";
import { AddressForm } from "./AddressForm";
import type { AddressFormValues } from "@/validations/address.schema";

interface AddressFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressFormValues) => void;
  isSubmitting: boolean;
  initialData?: Address | null;
}

export function AddressFormDialog({ isOpen, onClose, onSubmit, isSubmitting, initialData }: AddressFormDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex items-center justify-between shrink-0">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MapPin className="text-primary w-5 h-5" />
            {initialData ? "Edit Address" : "Add New Address"}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <AddressForm 
            initialData={initialData} 
            onSubmit={onSubmit} 
            isSubmitting={isSubmitting} 
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
