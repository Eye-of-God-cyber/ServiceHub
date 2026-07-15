"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ROUTES } from "@/constants/routes";

import { loginSchema, LoginFormData } from "../schema/auth.schema";
import { loginRequest } from "../hooks/authService";
import { useAuth } from "@/providers/AuthProvider";
import { ROLE_DASHBOARD_MAP } from "../constants/auth.constants";
import { parseApiError } from "@/utils/parseApiError";
import { PasswordInput } from "../components/PasswordInput";
import { LoadingButton } from "../components/LoadingButton";
import { FormError } from "../components/FormError";
import { SocialButton } from "../components/SocialButton";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (isLoading) return; // Prevent duplicate submissions
    setIsLoading(true);

    try {
      const { accessToken, user } = await loginRequest({
        email: data.email,
        password: data.password,
      });

      // Hydrate the AuthContext and persist to localStorage
      login(accessToken, user);

      toast.success("Welcome back!", {
        description: `Signed in as ${user.email}`,
      });

      // If the user was redirected here from a protected route, return them there.
      // Otherwise fall back to the role's default dashboard.
      const returnTo = searchParams.get("returnTo");
      const destination =
        returnTo
          ? decodeURIComponent(returnTo)
          : (ROLE_DASHBOARD_MAP[user.role] ?? ROUTES.DASHBOARD);
      router.push(destination);
    } catch (error) {
      const message = parseApiError(error);
      toast.error("Sign in failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
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
              autoFocus
              disabled={isLoading}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </div>
          <FormError message={errors.email?.message} />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FormError message={errors.password?.message} />
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2 pt-1 pb-2">
          <Checkbox
            id="rememberMe"
            disabled={isLoading}
            {...register("rememberMe")}
          />
          <Label
            htmlFor="rememberMe"
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
          >
            Remember me for 30 days
          </Label>
        </div>

        {/* Submit */}
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Signing in..."
        >
          Sign In
        </LoadingButton>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SocialButton
          provider="Google"
          disabled={isLoading}
          icon={
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          }
        />
        <SocialButton
          provider="Apple"
          disabled={isLoading}
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.68.727-1.326 2.156-1.14 3.533 1.34.105 2.61-.636 3.427-1.521z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
