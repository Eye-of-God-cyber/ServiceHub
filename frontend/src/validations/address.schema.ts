import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().optional().nullable(),
  line1: z.string().min(1, "Address line 1 is required").max(255),
  line2: z.string().max(255).optional().nullable(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  pincode: z.string().regex(/^\d{6}$/, "Must be a 6-digit pin code"),
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
