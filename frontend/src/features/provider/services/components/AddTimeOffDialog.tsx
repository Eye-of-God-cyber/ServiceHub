"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateProviderTimeOff } from "../hooks/useProviderTimeOff";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { parseApiError } from "@/utils/parseApiError";

const addTimeOffSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().max(255).optional(),
}).refine(data => data.startDate <= data.endDate, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

type FormValues = z.infer<typeof addTimeOffSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTimeOffDialog({ open, onOpenChange }: Props) {
  const addMutation = useCreateProviderTimeOff();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(addTimeOffSchema),
    defaultValues: { startDate: "", endDate: "", reason: "" }
  });

  const onSubmit = (data: FormValues) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Time-off added successfully");
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
          <DialogTitle>Schedule Time-Off</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date *</label>
              <Input type="date" {...register("startDate")} />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date *</label>
              <Input type="date" {...register("endDate")} />
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason (Optional)</label>
            <Textarea placeholder="Vacation, Sick leave, etc." {...register("reason")} />
            {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
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
