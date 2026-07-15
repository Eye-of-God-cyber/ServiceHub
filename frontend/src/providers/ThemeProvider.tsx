"use client";

/**
 * ThemeProvider — placeholder.
 *
 * Wraps the app with a theme context. In a later milestone this will be
 * replaced with `next-themes` <ThemeProvider> to support light / dark / system
 * themes and persist the user's preference via localStorage.
 *
 * For now it simply renders its children so the provider tree is complete
 * and other providers can be composed around it without errors.
 */

import React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // TODO (later milestone): wire up next-themes or a custom ThemeContext
  return <>{children}</>;
}
