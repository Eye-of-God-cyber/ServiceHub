"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateProviderService } from "../hooks/useProviderServices";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { type ProviderService } from "../types/domain.types";
import { parseApiError } from "@/utils/parseApiError";
import { Checkbox } from "@/components/ui/checkbox";

const editServiceSchema = z.object({
  customPrice: z.string().optional(),
  description: z.string().max(500).optional(),
  isAvailable: z.boolean(),
});

type FormValues = z.infer<typeof editServiceSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ProviderService;
}

export function EditProviderServiceDialog({ open, onOpenChange, service }: Props) {
  const updateMutation = useUpdateProviderService();

  const { register, handleSubmit, setValue, reset, control } = useForm<FormValues>({
    resolver: zodResolver(editServiceSchema),
    defaultValues: {
      customPrice: service.customPrice !== null ? String(service.customPrice) : "",
      description: service.description || "",
      isAvailable: service.isAvailable,
    }
  });

  // Reset form when service changes
  useEffect(() => {
    if (open) {
      reset({
        customPrice: service.customPrice !== null ? String(service.customPrice) : "",
        description: service.description || "",
        isAvailable: service.isAvailable,
      });
    }
  }, [open, service, reset]);

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate({
      id: service.id,
      payload: {
        customPrice: data.customPrice ? parseFloat(data.customPrice) : undefined,
        description: data.description || undefined,
        isAvailable: data.isAvailable,
      }
    }, {
      onSuccess: () => {
        toast.success("Service updated successfully");
        onOpenChange(false);
      },
      onError: (error: unknown) => {
        toast.error(parseApiError(error));
      }
    });
  };

  const isAvailable = useWatch({ control, name: "isAvailable" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Service Name</label>
            <Input value={service.baseServiceName} disabled />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Price (Optional)</label>
            <Input type="number" step="0.01" min="0" placeholder={`Base price: $${service.basePrice.toFixed(2)}`} {...register("customPrice")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea placeholder="Provide additional details..." {...register("description")} />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="isAvailable" 
              checked={isAvailable} 
              onCheckedChange={(checked) => setValue("isAvailable", checked as boolean)} 
            />
            <label
              htmlFor="isAvailable"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Currently Available
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
