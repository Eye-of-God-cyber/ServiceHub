import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AppProviders } from "@/providers";
import { AppShell } from "@/components";

// ── Fonts ─────────────────────────────────────────────────────────────────────
// Geist Sans is used for body text; Geist Mono for code / monospace contexts.
// Both are loaded via next/font/google for zero-CLS font optimisation.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "ServiceHub — Home Services Marketplace",
    template: "%s | ServiceHub",
  },
  description:
    "Discover and book trusted home service professionals. Plumbing, electrical, cleaning, and more — on demand.",
  keywords: ["home services", "plumbing", "electrical", "cleaning", "booking"],
  authors: [{ name: "ServiceHub Engineering" }],
  openGraph: {
    type: "website",
    siteName: "ServiceHub",
    title: "ServiceHub — Home Services Marketplace",
    description:
      "Discover and book trusted home service professionals on demand.",
  },
};

// ── Root Layout ───────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/*
         * AppProviders wraps the entire tree with:
         *   ThemeProvider → QueryProvider → AuthProvider
         *
         * AppShell renders Navbar + main content area + Footer.
         * showSidebar=false for the root layout — individual dashboard
         * routes will render their own AppShell with showSidebar=true.
         */}
        <AppProviders>
          <AppShell showSidebar={false}>{children}</AppShell>
          {/*
           * Toaster must be inside AppProviders so any provider-level
           * toast calls (e.g. from AuthProvider logout) work correctly.
           * richColors gives success/error/warning distinct color treatment.
           * position="top-right" matches common SaaS UX conventions.
           */}
          <Toaster richColors position="top-right" closeButton />
        </AppProviders>
      </body>
    </html>
  );
}
