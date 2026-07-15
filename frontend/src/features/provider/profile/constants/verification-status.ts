import { type VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

export const VERIFICATION_STATUS_BADGE_MAP: Record<string, VariantProps<typeof badgeVariants>['variant']> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
  UNVERIFIED: 'outline'
};
