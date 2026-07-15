import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-muted/30 py-12 sm:px-6 lg:px-8">
      {/* Optional: Add a simple back-to-home branding at the top */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 font-bold text-xl tracking-tight transition-opacity hover:opacity-80"
        >
          <span className="text-primary">Service</span>
          <span>Hub</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* The children will render the specific auth page (e.g. login/page.tsx)
            which will utilize the AuthCard component. */}
        <main className="flex justify-center px-4 sm:px-0">{children}</main>
      </div>
    </div>
  );
}
