"use client";

import { useState } from "react";
import { useProfile, useUpdateProfile } from "@/features/profile/hooks";
import { ProfileCard, EditProfileForm } from "@/features/profile/components";
import type { ProfileFormValues } from "@/validations/profile.schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto space-y-6">
        <div className="h-48 bg-muted animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container py-12 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
        <p className="text-muted-foreground mb-6">
          Could not load your profile information.
        </p>
      </div>
    );
  }

  const handleSubmit = (data: ProfileFormValues) => {
    updateProfile(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        avatarUrl: data.avatarUrl || undefined,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences.
          </p>
        </div>
        <Button render={<Link href={ROUTES.ADDRESSES} />} variant="outline" className="shadow-sm">
          <MapPin className="w-4 h-4 mr-2" />
          Manage Addresses
        </Button>
      </div>

      {!isEditing ? (
        <ProfileCard profile={profile} onEditClick={() => setIsEditing(true)} />
      ) : (
        <div className="bg-card border rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
          <EditProfileForm 
            profile={profile} 
            onSubmit={handleSubmit} 
            isSubmitting={isPending} 
            onCancel={() => setIsEditing(false)} 
          />
        </div>
      )}
    </div>
  );
}
