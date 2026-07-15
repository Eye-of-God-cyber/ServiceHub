import { User, Mail, Phone, Calendar, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "../types/domain.types";

interface ProfileCardProps {
  profile: UserProfile;
  onEditClick: () => void;
}

export function ProfileCard({ profile, onEditClick }: ProfileCardProps) {
  const formattedDate = profile.dateOfBirth 
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(profile.dateOfBirth)
    : "Not provided";

  return (
    <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-start items-center relative">
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute top-6 right-6" 
          onClick={onEditClick}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>

        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0 text-3xl font-bold text-primary relative overflow-hidden">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} alt={profile.firstName} className="w-full h-full object-cover" />
          ) : (
            <span>{profile.firstName?.charAt(0) || <User />}</span>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-4 w-full">
          <div>
            <h2 className="text-2xl font-bold">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-muted-foreground capitalize mt-1">
              {profile.role.toLowerCase()}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 pt-4 border-t">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Email Address</p>
                <p className="font-medium truncate">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Phone Number</p>
                <p className="font-medium truncate">{profile.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Date of Birth</p>
                <p className="font-medium truncate">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
