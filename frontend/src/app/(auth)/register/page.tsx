import { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { AuthFooter } from "@/features/auth/components/AuthFooter";
import { RegisterForm } from "@/features/auth/forms/RegisterForm";
import { ROUTES } from "@/constants/routes";
import { CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Join ServiceHub to book or provide home services",
};

export default function RegisterPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Create an account"
        description="Join ServiceHub today"
      />
      <CardContent>
        <RegisterForm />
      </CardContent>
      <AuthFooter
        text="Already have an account?"
        linkText="Log in"
        href={ROUTES.LOGIN}
      />
    </AuthCard>
  );
}
