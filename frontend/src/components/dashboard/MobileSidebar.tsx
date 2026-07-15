"use client";

/**
 * MobileSidebar — off-canvas drawer navigation for mobile (<md).
 *
 * Uses Shadcn's Sheet component. State is controlled by SidebarContext,
 * allowing the Header hamburger menu to open it.
 *
 * When a nav link is clicked, the drawer closes automatically.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useSidebar } from "@/providers/SidebarProvider";
import { NavItem } from "./NavItem";
import { Separator } from "@/components/ui/separator";
import type { NavConfig } from "@/constants/navigation";

interface MobileSidebarProps {
  navConfig: NavConfig;
  brandName?: string;
}

export function MobileSidebar({ navConfig, brandName = "ServiceHub" }: MobileSidebarProps) {
  const { isMobileOpen, closeMobile } = useSidebar();
  const pathname = usePathname();

  // Close the drawer automatically when navigating to a new route.
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  return (
    <Sheet open={isMobileOpen} onOpenChange={closeMobile}>
      {/* 
        SheetContent defaults to side="right". We want a left drawer.
        The SheetTitle is hidden but required for screen reader accessibility.
      */}
      <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-r-sidebar-border">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        
        {/* ── Brand ──────────────────────────────────────────────────────── */}
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
          <Link
            href="/"
            onClick={closeMobile}
            className="flex items-center gap-2 font-bold text-sidebar-foreground"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-black">
              S
            </span>
            <span className="truncate text-lg tracking-tight">
              {brandName}
            </span>
          </Link>
        </div>

        {/* ── Navigation ─────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {navConfig.map((group, gi) => (
            <div key={gi}>
              {group.title && (
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isCollapsed={false}
                    onClick={closeMobile}
                  />
                ))}
              </div>
              {gi < navConfig.length - 1 && (
                <Separator className="mt-4 bg-sidebar-border/50" />
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
