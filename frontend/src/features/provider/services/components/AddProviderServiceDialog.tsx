"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useServices } from "@/features/catalog/hooks/useServices";
import { useAddProviderService } from "../hooks/useProviderServices";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { parseApiError } from "@/utils/parseApiError";

const addServiceSchema = z.object({
  serviceId: z.string().min(1, "Service selection is required"),
  customPrice: z.string().optional(),
  description: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof addServiceSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProviderServiceDialog({ open, onOpenChange }: Props) {
  const { data: catalogServices, isLoading: isLoadingCatalog } = useServices();
  const addMutation = useAddProviderService();

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: { serviceId: "", customPrice: "", description: "" }
  });

  const onSubmit = (data: FormValues) => {
    addMutation.mutate({
      serviceId: parseInt(data.serviceId, 10),
      customPrice: data.customPrice ? parseFloat(data.customPrice) : undefined,
      description: data.description || undefined,
      isAvailable: true,
    }, {
      onSuccess: () => {
        toast.success("Service added successfully");
        reset();
        onOpenChange(false);
      },
      onError: (error: unknown) => {
        toast.error(parseApiError(error));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Service *</label>
            <Select onValueChange={(val: string | null) => { if (val) setValue("serviceId", val); }}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingCatalog ? "Loading services..." : "Select a base service"} />
              </SelectTrigger>
              <SelectContent>
                {catalogServices?.map(s => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.title} (${s.startingPrice.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceId && <p className="text-xs text-destructive">{errors.serviceId.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Price (Optional)</label>
            <Input type="number" step="0.01" min="0" placeholder="e.g. 50.00" {...register("customPrice")} />
            <p className="text-xs text-muted-foreground">Leave blank to use the base price.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea placeholder="Provide additional details..." {...register("description")} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={addMutation.isPending}>
              {addMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
