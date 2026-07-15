import { z } from "zod";
import { ROLES } from "@/constants/roles";

// Password regex patterns to match backend requirements
const HAS_LOWERCASE = /(?=.*[a-z])/;
const HAS_UPPERCASE = /(?=.*[A-Z])/;
const HAS_NUMBER = /(?=.*\d)/;
const HAS_SPECIAL = /(?=.*[\W_])/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Valid email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: "First name is required" })
      .max(50, { message: "First name cannot exceed 50 characters" }),

    lastName: z
      .string()
      .trim()
      .min(1, { message: "Last name is required" })
      .max(50, { message: "Last name cannot exceed 50 characters" }),

    email: z
      .string()
      .trim()
      .min(1, { message: "Email is required" })
      .email({ message: "Must be a valid email address" }),

    phone: z
      .string()
      .trim()
      .min(1, { message: "Phone number is required" })
      .regex(/^[6-9]\d{9}$/, {
        message: "Must be a valid 10-digit Indian mobile number starting with 6-9",
      }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(HAS_LOWERCASE, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(HAS_UPPERCASE, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(HAS_NUMBER, { message: "Password must contain at least one number" })
      .regex(HAS_SPECIAL, {
        message: "Password must contain at least one special character",
      }),

    confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),

    role: z.enum([ROLES.CUSTOMER, ROLES.PROVIDER], {
      message: "Role must be either CUSTOMER or PROVIDER",
    }),

    termsAccepted: z.literal(true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
