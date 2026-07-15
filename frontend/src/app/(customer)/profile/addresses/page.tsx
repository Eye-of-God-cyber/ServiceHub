"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

import { 
  useProfileAddresses, 
  useCreateAddress, 
  useUpdateAddress, 
  useDeleteAddress, 
  useSetDefaultAddress 
} from "@/features/profile/hooks";
import { 
  AddressList, 
  AddressFormDialog, 
  DeleteAddressDialog 
} from "@/features/profile/components";
import type { Address } from "@/shared/types/address/domain.types";
import type { AddressFormValues } from "@/validations/address.schema";

export default function AddressesPage() {
  const { data: addresses, isLoading, error } = useProfileAddresses();
  
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();
  const { mutate: setDefaultAddress, isPending: isSettingDefault } = useSetDefaultAddress();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleSubmit = (data: AddressFormValues) => {
    if (editingAddress) {
      updateAddress(
        { addressId: editingAddress.id, payload: data },
        { onSuccess: handleCloseForm }
      );
    } else {
      createAddress(data, { onSuccess: handleCloseForm });
    }
  };

  const handleConfirmDelete = () => {
    if (deletingAddressId) {
      deleteAddress(deletingAddressId, {
        onSuccess: () => setDeletingAddressId(null),
      });
    }
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <Link
            href={ROUTES.PROFILE}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-3"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">Saved Addresses</h1>
        </div>
        
        <Button onClick={handleOpenAdd} className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      <AddressList 
        addresses={addresses || []}
        isLoading={isLoading}
        error={error}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(id) => setDeletingAddressId(id)}
        onSetDefault={(id) => setDefaultAddress(id)}
        isSettingDefault={isSettingDefault}
      />

      <AddressFormDialog 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
        initialData={editingAddress}
      />

      <DeleteAddressDialog 
        isOpen={!!deletingAddressId}
        onClose={() => setDeletingAddressId(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
