import type { Address } from "@/shared/types/address/domain.types";
import { AddressCard } from "./AddressCard";
import { EmptyAddressState } from "./EmptyAddressState";

interface AddressListProps {
  addresses: Address[];
  isLoading: boolean;
  error?: Error | null;
  onAdd: () => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault?: (id: string) => void;
  isSettingDefault?: boolean;
}

export function AddressList({ 
  addresses, isLoading, error, onAdd, onEdit, onDelete, onSetDefault, isSettingDefault 
}: AddressListProps) {
  if (error) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 rounded-2xl border border-destructive/20">
        <h3 className="font-semibold mb-2">Failed to load addresses</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-muted/50 animate-pulse border" />
        ))}
      </div>
    );
  }

  if (addresses.length === 0) {
    return <EmptyAddressState onAdd={onAdd} />;
  }

  // Sort so default is first
  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return 0;
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sortedAddresses.map((address) => (
        <AddressCard 
          key={address.id} 
          address={address} 
          onEdit={onEdit} 
          onDelete={onDelete}
          onSetDefault={onSetDefault}
          isSettingDefault={isSettingDefault}
        />
      ))}
    </div>
  );
}
