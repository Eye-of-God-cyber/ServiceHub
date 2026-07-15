import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAddressStateProps {
  onAdd: () => void;
}

export function EmptyAddressState({ onAdd }: EmptyAddressStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-2xl bg-muted/20">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <MapPin className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">No addresses saved</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Add your home or work address to easily book services without entering details every time.
      </p>
      <Button onClick={onAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add Address
      </Button>
    </div>
  );
}
