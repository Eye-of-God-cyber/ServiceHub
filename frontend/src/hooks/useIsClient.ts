/**
 * useIsClient — detects whether the component is rendering on the client.
 *
 * Built on useSyncExternalStore, which is React 18's recommended API for
 * subscribing to external stores. It accepts a server snapshot and a client
 * snapshot; React reconciles the mismatch without emitting a hydration warning.
 *
 * Why this matters for route guards:
 * ─────────────────────────────────────────────────────────────────────────────
 * During SSR, localStorage is unavailable. The AuthProvider lazy initialiser
 * returns an empty session on the server. If AuthGuard immediately acts on
 * `isAuthenticated: false`, it would redirect authenticated users to /login on
 * every server render — a flash of wrong content.
 *
 * useIsClient() returns false on the server and true on the client. AuthGuard
 * renders a loading boundary while `!isClient`, then checks auth state only
 * after hydration is complete. This eliminates the flicker entirely.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useSyncExternalStore } from "react";

// subscribe is a noop because this store never changes after hydration.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const subscribe = (_callback: () => void) => () => {};

export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,   // client snapshot — after hydration, always true
    () => false   // server snapshot — during SSR, always false
  );
}
