"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Mail, Phone, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { registerSchema, RegisterFormData } from "../schema/auth.schema";
import { registerRequest } from "../hooks/authService";
import { REGISTER_REDIRECT_DELAY_MS } from "../constants/auth.constants";
import { parseApiError } from "@/utils/parseApiError";
import { PasswordInput } from "../components/PasswordInput";
import { LoadingButton } from "../components/LoadingButton";
import { FormError } from "../components/FormError";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: ROLES.CUSTOMER as "CUSTOMER" | "PROVIDER",
      termsAccepted: undefined,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (isLoading) return; // Prevent duplicate submissions
    setIsLoading(true);

    try {
      const { message } = await registerRequest({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
      });

      // Show the backend success message — do NOT auto-login
      toast.success(message || "Account created successfully!", {
        description: "Redirecting you to the login page...",
        duration: REGISTER_REDIRECT_DELAY_MS,
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, REGISTER_REDIRECT_DELAY_MS);
    } catch (error) {
      const message = parseApiError(error);
      toast.error("Registration failed", { description: message });
      setIsLoading(false);
    }
    // Note: we don't set isLoading=false on success intentionally —
    // the button stays disabled while the redirect delay elapses.
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Fields Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="firstName"
              placeholder="Amisha"
              className="pl-9"
              autoComplete="given-name"
              disabled={isLoading}
              aria-invalid={!!errors.firstName}
              {...register("firstName")}
            />
          </div>
          <FormError message={errors.firstName?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Singh"
            autoComplete="family-name"
            disabled={isLoading}
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
          <FormError message={errors.lastName?.message} />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="pl-9"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </div>
        <FormError message={errors.email?.message} />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="phone"
            type="tel"
            placeholder="9876543210"
            className="pl-9"
            autoComplete="tel"
            disabled={isLoading}
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </div>
        <FormError message={errors.phone?.message} />
      </div>

      {/* Role Selector */}
      <div className="space-y-2">
        <Label htmlFor="role">I want to...</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoading}
            >
              <SelectTrigger id="role" aria-invalid={!!errors.role}>
                <SelectValue placeholder="Select an account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ROLES.CUSTOMER}>
                  Book Services (Customer)
                </SelectItem>
                <SelectItem value={ROLES.PROVIDER}>
                  Provide Services (Provider)
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FormError message={errors.role?.message} />
      </div>

      {/* Password row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isLoading}
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FormError message={errors.password?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isLoading}
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          <FormError message={errors.confirmPassword?.message} />
        </div>
      </div>

      {/* Terms */}
      <div className="space-y-2 pt-2 pb-2">
        <div className="flex items-start space-x-2">
          <Controller
            control={control}
            name="termsAccepted"
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value === true}
                onCheckedChange={field.onChange}
                disabled={isLoading}
                aria-invalid={!!errors.termsAccepted}
              />
            )}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="terms"
              className="text-sm font-normal cursor-pointer select-none"
            >
              I agree to the{" "}
              <Link href="#" className="text-primary hover:underline font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>
              .
            </Label>
          </div>
        </div>
        <FormError message={errors.termsAccepted?.message} />
      </div>

      {/* Submit */}
      <LoadingButton
        type="submit"
        isLoading={isLoading}
        loadingText="Creating account..."
      >
        Create Account
      </LoadingButton>
    </form>
  );
}
