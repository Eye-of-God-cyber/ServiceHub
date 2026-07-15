import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormValues } from "@/validations/address.schema";
import type { Address } from "@/shared/types/address/domain.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AddressFormProps {
  initialData?: Address | null;
  onSubmit: (data: AddressFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function AddressForm({ initialData, onSubmit, isSubmitting, onCancel }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: initialData?.label === "Other" ? "" : initialData?.label || "",
      line1: initialData?.line1 || "",
      line2: initialData?.line2 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      pincode: initialData?.pincode || "",
      isDefault: initialData?.isDefault || false,
    },
  });

  const isDefault = useWatch({ control, name: "isDefault" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label (e.g. Home, Work)</Label>
        <Input id="label" {...register("label")} disabled={isSubmitting} placeholder="Optional" />
        {errors.label && <p className="text-sm text-destructive">{errors.label.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="line1">Address Line 1</Label>
        <Input id="line1" {...register("line1")} disabled={isSubmitting} placeholder="Street address, P.O. box, etc." />
        {errors.line1 && <p className="text-sm text-destructive">{errors.line1.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="line2">Address Line 2</Label>
        <Input id="line2" {...register("line2")} disabled={isSubmitting} placeholder="Apartment, suite, unit, etc. (optional)" />
        {errors.line2 && <p className="text-sm text-destructive">{errors.line2.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} disabled={isSubmitting} />
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register("state")} disabled={isSubmitting} />
          {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pincode">PIN / Postal Code</Label>
        <Input id="pincode" {...register("pincode")} disabled={isSubmitting} />
        {errors.pincode && <p className="text-sm text-destructive">{errors.pincode.message}</p>}
      </div>

      {!initialData?.isDefault && (
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="isDefault" 
            checked={isDefault}
            onCheckedChange={(checked) => setValue("isDefault", checked as boolean)}
            disabled={isSubmitting}
          />
          <Label htmlFor="isDefault" className="font-normal cursor-pointer">
            Set as default address
          </Label>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  );
}
