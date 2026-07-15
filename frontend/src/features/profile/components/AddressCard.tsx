import { MapPin, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Address } from "@/shared/types/address/domain.types";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault?: (id: string) => void;
  isSettingDefault?: boolean;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault, isSettingDefault }: AddressCardProps) {
  return (
    <div className={`bg-card border rounded-2xl p-6 shadow-sm flex flex-col relative transition-all ${address.isDefault ? 'border-primary shadow-md' : 'hover:border-primary/50'}`}>
      {address.isDefault && (
        <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Default
        </div>
      )}
      
      <div className="flex gap-4 mb-4">
        <div className="bg-primary/10 p-3 rounded-full h-fit text-primary">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            {address.label}
          </h3>
          <p className="text-muted-foreground mt-2 line-clamp-2">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
          </p>
          <p className="text-muted-foreground mt-0.5">
            {address.city}, {address.state} {address.pincode}
          </p>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(address)}>
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(address.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      {!address.isDefault && onSetDefault && (
        <div className="mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-primary hover:text-primary hover:bg-primary/10"
            onClick={() => onSetDefault(address.id)}
            disabled={isSettingDefault}
          >
            Set as Default
          </Button>
        </div>
      )}
    </div>
  );
}
