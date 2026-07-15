"use client";

/**
 * Sidebar — desktop/tablet fixed navigation panel.
 *
 * Responsive behaviour:
 *  • Hidden on mobile (<md) — MobileSidebar handles mobile via Sheet
 *  • Visible on md+ as a fixed panel on the left
 *  • Expanded (w-64): icon + label
 *  • Collapsed (w-16): icon only, labels in Tooltips
 *
 * The collapse toggle button is rendered at the bottom of the sidebar.
 * State is managed by SidebarContext (persisted to localStorage).
 */

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/SidebarProvider";
import { NavItem } from "./NavItem";
import { Separator } from "@/components/ui/separator";
import type { NavConfig } from "@/constants/navigation";

interface SidebarProps {
  navConfig: NavConfig;
  brandName?: string;
}

export function Sidebar({ navConfig, brandName = "ServiceHub" }: SidebarProps) {
  const { isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <aside
      className={cn(
        // Hidden on mobile — MobileSidebar handles it
        "hidden md:flex flex-col",
        "fixed left-0 top-0 h-screen z-30",
        "bg-sidebar border-r border-sidebar-border",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* ── Brand ──────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border",
          isCollapsed ? "justify-center px-2" : "px-5"
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-sidebar-foreground"
          aria-label="ServiceHub home"
        >
          {/* Brand dot — visible in both states */}
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-black">
            S
          </span>
          {!isCollapsed && (
            <span className="truncate text-base tracking-tight">
              {brandName}
            </span>
          )}
        </Link>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-1">
        {navConfig.map((group, gi) => (
          <div key={gi} className="mb-2">
            {/* Section title — only visible when expanded */}
            {group.title && !isCollapsed && (
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                {group.title}
              </p>
            )}
            {group.title && isCollapsed && gi > 0 && (
              <Separator className="my-2 bg-sidebar-border" />
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Collapse toggle ────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-sidebar-border p-2">
        <button
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm",
            "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isCollapsed && "justify-center px-2"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
