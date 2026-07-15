"use client";

/**
 * AppProviders — composes all context providers in the correct nesting order.
 *
 * Nesting order (outermost → innermost):
 *   ThemeProvider   — must be outermost so all children can read the theme
 *   QueryProvider   — TanStack Query; must wrap AuthProvider so auth queries
 *                     can be made during initialisation
 *   AuthProvider    — must be inside QueryProvider so it can use useQuery
 *   TooltipProvider — Shadcn Tooltip requires a provider; innermost so all
 *                     dashboard components can use Tooltip without extra wrappers
 *
 * Adding a new provider: import it here and wrap it in the correct position
 * rather than nesting it directly inside layout.tsx — keeps layout.tsx clean.
 */

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "./AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <TooltipProvider delay={300}>{children}</TooltipProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
