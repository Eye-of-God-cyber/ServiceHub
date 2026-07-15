"use client";

/**
 * AuthGuard — the core protected route component.
 *
 * Responsibilities:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Shows AuthLoadingBoundary while the client hasn't hydrated yet (useIsClient)
 *    to prevent any flash of incorrect content.
 *
 * 2. Shows AuthLoadingBoundary while isLoading is true in AuthContext
 *    (reserved for future token-refresh flows).
 *
 * 3. If unauthenticated, redirects to /login with a `returnTo` query param so
 *    the user can be returned to the intended destination after login.
 *    Redirect is gated to prevent loops if already on the login page.
 *
 * 4. If authenticated, renders children.
 *
 * Usage:
 *   Wrap protected layout groups with <AuthGuard>. Do NOT scatter auth checks
 *   across individual pages — route groups centralise the concern.
 *
 * Architecture note — why useIsClient is critical:
 *   The AuthProvider lazy initialiser returns emptySession on the server
 *   (window is undefined). Without useIsClient, AuthGuard would see
 *   isAuthenticated=false on the first server render and redirect to /login,
 *   even for users who ARE authenticated. useIsClient ensures we defer the
 *   auth check until AFTER the client has hydrated and read localStorage.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useIsClient } from "@/hooks/useIsClient";
import { ROUTES } from "@/constants/routes";
import { AuthLoadingBoundary } from "./AuthLoadingBoundary";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const isClient = useIsClient();

  // ── Phase 1: Pre-hydration ─────────────────────────────────────────────────
  // Show loading boundary on every server render and on the first client
  // render before hydration completes. This prevents a flash of the redirect.
  if (!isClient || isLoading) {
    return <AuthLoadingBoundary />;
  }

  // ── Phase 2: Auth check (client-only, post-hydration) ──────────────────────
  if (!isAuthenticated) {
    // Preserve the intended destination so we can redirect back after login.
    // Encode the pathname to handle special characters in URLs safely.
    const returnTo = encodeURIComponent(pathname);
    const loginUrl =
      pathname === ROUTES.LOGIN
        ? ROUTES.LOGIN
        : `${ROUTES.LOGIN}?returnTo=${returnTo}`;

    router.replace(loginUrl);
    // Render loading boundary during the redirect transition — avoids a
    // momentary flash of the protected page content.
    return <AuthLoadingBoundary label="Redirecting to login…" />;
  }

  // ── Phase 3: Authenticated — render children ───────────────────────────────
  return <>{children}</>;
}
