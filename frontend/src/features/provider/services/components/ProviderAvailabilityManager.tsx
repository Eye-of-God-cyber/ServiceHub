"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProviderAvailability, useUpdateProviderAvailability } from "../hooks/useProviderAvailability";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { parseApiError } from "@/utils/parseApiError";


const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const scheduleSchema = z.object({
  dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  startTime: z.string().regex(TIME_REGEX, "Format HH:MM").min(1),
  endTime: z.string().regex(TIME_REGEX, "Format HH:MM").min(1),
  isAvailable: z.boolean(),
}).refine(data => !data.isAvailable || data.startTime < data.endTime, {
  message: "End time must be after start",
  path: ["endTime"],
});

const availabilitySchema = z.object({
  schedules: z.array(scheduleSchema),
});

type FormValues = z.infer<typeof availabilitySchema>;

const DEFAULT_SCHEDULES: FormValues["schedules"] = [
  { dayOfWeek: "MONDAY", startTime: "09:00", endTime: "17:00", isAvailable: true },
  { dayOfWeek: "TUESDAY", startTime: "09:00", endTime: "17:00", isAvailable: true },
  { dayOfWeek: "WEDNESDAY", startTime: "09:00", endTime: "17:00", isAvailable: true },
  { dayOfWeek: "THURSDAY", startTime: "09:00", endTime: "17:00", isAvailable: true },
  { dayOfWeek: "FRIDAY", startTime: "09:00", endTime: "17:00", isAvailable: true },
  { dayOfWeek: "SATURDAY", startTime: "10:00", endTime: "14:00", isAvailable: false },
  { dayOfWeek: "SUNDAY", startTime: "10:00", endTime: "14:00", isAvailable: false },
];

export function ProviderAvailabilityManager() {
  const { data: availability, isLoading, isError, refetch } = useProviderAvailability();
  const updateMutation = useUpdateProviderAvailability();

  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { schedules: DEFAULT_SCHEDULES },
  });

  const { fields } = useFieldArray({
    control,
    name: "schedules",
  });

  const watchedSchedules = useWatch({ control, name: "schedules" });

  useEffect(() => {
    if (availability && availability.length > 0) {
      reset({ schedules: availability as unknown as FormValues["schedules"] });
    }
  }, [availability, reset]);

  const onSubmit = (data: FormValues) => {
    // Only send the ones marked as available or we could send all. The backend replaces them anyway.
    updateMutation.mutate({ schedules: data.schedules }, {
      onSuccess: () => toast.success("Availability updated successfully"),
      onError: (error: unknown) => {
        toast.error(parseApiError(error));
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-destructive/10 rounded-xl border border-destructive/20 text-destructive">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
        <h3 className="text-lg font-bold mb-2">Failed to load availability</h3>
        <button onClick={() => refetch()} className="underline font-medium">Retry</button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
        <CardDescription>Set your standard working hours for the week.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4">
            {fields.map((field, index) => {
              const isAvailable = watchedSchedules?.[index]?.isAvailable ?? field.isAvailable;
              return (
                <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border bg-card">
                  <div className="w-32 flex items-center gap-3">
                    <Checkbox
                      checked={isAvailable}
                      onCheckedChange={(checked) => setValue(`schedules.${index}.isAvailable`, checked as boolean)}
                    />
                    <span className="font-medium capitalize">{field.dayOfWeek.toLowerCase()}</span>
                  </div>

                  {isAvailable ? (
                    <div className="flex-1 flex items-center gap-2 w-full">
                      <div className="flex-1">
                        <Input
                          type="time"
                          {...register(`schedules.${index}.startTime`)}
                        />
                      </div>
                      <span className="text-muted-foreground">to</span>
                      <div className="flex-1">
                        <Input
                          type="time"
                          {...register(`schedules.${index}.endTime`)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 text-muted-foreground text-sm pl-2">Unavailable</div>
                  )}
                  
                  {errors.schedules?.[index]?.endTime && (
                    <div className="text-xs text-destructive mt-1 sm:mt-0 sm:w-1/4">
                      {errors.schedules[index]?.endTime?.message}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Schedule
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
