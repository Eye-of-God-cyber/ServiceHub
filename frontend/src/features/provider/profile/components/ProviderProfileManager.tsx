"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { useProviderProfile } from "../hooks/useProviderProfile";
import { useUpdateProviderProfile } from "../hooks/useUpdateProviderProfile";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { VERIFICATION_STATUS_BADGE_MAP } from "../constants/verification-status";
import { parseApiError } from "@/utils/parseApiError";

const profileSchema = z.object({
  firstName: z.string().max(50, "First name cannot exceed 50 characters").optional(),
  lastName: z.string().max(50, "Last name cannot exceed 50 characters").optional(),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
  experienceYears: z.number().min(0).max(60, "Experience years must be between 0 and 60").optional(),
  avatarUrl: z.string().url("Must be a valid URL").max(512).optional().or(z.literal("")),
  isAvailable: z.boolean().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProviderProfileManager() {
  const { data: profile, isLoading, isError, error: fetchError } = useProviderProfile();
  const { mutate: updateProfile, isPending: isUpdating, error: updateError } = useUpdateProviderProfile();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      experienceYears: 0,
      avatarUrl: "",
      isAvailable: false,
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        experienceYears: profile.experienceYears,
        avatarUrl: profile.avatarUrl,
        isAvailable: profile.isAvailable,
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile({
      ...data,
      avatarUrl: data.avatarUrl === "" ? null : data.avatarUrl,
    });
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  if (isError || !profile) {
    return <div className="p-4 text-center text-red-500">{parseApiError(fetchError)}</div>;
  }

  const badgeVariant = VERIFICATION_STATUS_BADGE_MAP[profile.verificationStatus] || "secondary";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>Read-only information managed by the system.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="text-sm font-medium text-muted-foreground block">Email</span>
            <span>{profile.email}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground block">Phone</span>
            <span>{profile.phone}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground block">Verification Status</span>
            <Badge variant={badgeVariant}>{profile.verificationStatus}</Badge>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground block">Wallet Balance</span>
            <span className="font-semibold text-primary">${profile.balance}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your personal and public-facing profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {updateError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-4">
                {parseApiError(updateError)}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input {...register("firstName")} placeholder="First Name" />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input {...register("lastName")} placeholder="Last Name" />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar URL</label>
              <Input {...register("avatarUrl")} placeholder="https://example.com/avatar.jpg" />
              {errors.avatarUrl && <p className="text-xs text-destructive">{errors.avatarUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea {...register("bio")} placeholder="Tell customers about yourself..." rows={4} />
              {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience (Years)</label>
                <Input type="number" {...register("experienceYears", { valueAsNumber: true })} placeholder="e.g. 5" />
                {errors.experienceYears && <p className="text-xs text-destructive">{errors.experienceYears.message}</p>}
              </div>
              
              <div className="flex flex-row items-center gap-2 pt-8">
                <Controller
                  name="isAvailable"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label className="text-sm font-medium">Accepting New Bookings</label>
              </div>
            </div>

            <Button type="submit" disabled={isUpdating} className="mt-4">
              {isUpdating ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
