import { MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Address } from "../types/domain.types";

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  isLoading: boolean;
  error?: string;
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelectAddress,
  isLoading,
  error,
}: AddressSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Service Address</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 w-full rounded-xl border bg-card animate-pulse" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center bg-muted/20">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
          <h4 className="text-sm font-semibold mb-1">No saved addresses</h4>
          <p className="text-sm text-muted-foreground mb-4">
            You need a saved address to book a service.
          </p>
          {/* Note: Address creation is out of scope for this milestone */}
          <button className="text-sm font-medium text-primary hover:underline">
            Manage Addresses
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;
            return (
              <div
                key={address.id}
                onClick={() => onSelectAddress(address.id)}
                className={cn(
                  "relative cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                    : "bg-card hover:border-primary/50"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{address.label}</span>
                    {address.isDefault && (
                      <span className="text-[10px] uppercase font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        Default
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 pr-6">
                  {address.formattedAddress}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
