import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "Maximum 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Maximum 50 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit mobile number").optional().or(z.literal('')),
  dateOfBirth: z.string().optional().nullable(),
  avatarUrl: z.string().url("Must be a valid URL").max(512).optional().nullable().or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
