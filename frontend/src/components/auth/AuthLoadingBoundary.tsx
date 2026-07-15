/**
 * AuthLoadingBoundary — displayed while authentication state is being resolved.
 *
 * Renders a full-viewport centred spinner. This is shown in two situations:
 *  1. While useIsClient() is false (SSR / pre-hydration) — prevents flash of
 *     incorrect content before the client knows whether the user is logged in.
 *  2. When isLoading is true in AuthContext (reserved for future token refresh).
 *
 * Designed to be reusable across all protected layout groups.
 */

import { Loader2 } from "lucide-react";

interface AuthLoadingBoundaryProps {
  /** Optional label shown below the spinner for screen readers and sighted users */
  label?: string;
}

export function AuthLoadingBoundary({
  label = "Verifying your session…",
}: AuthLoadingBoundaryProps) {
  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-background"
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
