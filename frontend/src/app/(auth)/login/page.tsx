import { Suspense } from "react";
import { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { AuthFooter } from "@/features/auth/components/AuthFooter";
import { LoginForm } from "@/features/auth/forms/LoginForm";
import { ROUTES } from "@/constants/routes";
import { CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your ServiceHub account",
};

/**
 * LoginPage wraps LoginForm in a Suspense boundary.
 *
 * Next.js requires components that call useSearchParams() to be wrapped in
 * Suspense when the page is statically rendered. Without the boundary, the
 * build would fail with: "useSearchParams() should be wrapped in a suspense
 * boundary at page '/login'".
 *
 * The fallback is a minimal inline spinner that matches the card dimensions
 * so there is no layout shift when the form loads.
 */
export default function LoginPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Welcome back"
        description="Enter your email to sign in to your account"
      />
      <CardContent>
        <Suspense
          fallback={
            <div className="flex h-[380px] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </CardContent>
      <AuthFooter
        text="Don't have an account?"
        linkText="Sign up"
        href={ROUTES.REGISTER}
      />
    </AuthCard>
  );
}
