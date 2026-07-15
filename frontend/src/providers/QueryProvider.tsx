"use client";

/**
 * QueryProvider — wraps the app with TanStack React Query's QueryClientProvider.
 *
 * Architectural decisions:
 * ─────────────────────────────────────────────────────────────────────────────
 * • QueryClient is instantiated once per client-side session using useState so
 *   it is not shared between requests on the server (Next.js SSR safety).
 * • staleTime: 60 s — data is considered fresh for 60 s before a background
 *   refetch is triggered.  Keeps the UI snappy for repeat navigation.
 * • retry: 1 — failed queries retry once before surfacing an error, avoiding
 *   hammering the backend on a legitimate outage.
 * • ReactQueryDevtools is included only in development mode so the bundle
 *   stays lean in production.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 60 seconds
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
