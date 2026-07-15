"use client";

/**
 * NavItem — a single navigation link in the sidebar.
 *
 * Visual states:
 *  • Active: primary-coloured background + left accent border + bold text
 *  • Hover:  subtle muted background
 *  • Collapsed: icon-only, label shown in a Tooltip
 *
 * Accessibility:
 *  • <Link> renders as <a> natively — keyboard navigable
 *  • aria-current="page" on the active item
 *  • Tooltip provides accessible label when collapsed
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { NavItem as NavItemType } from "@/constants/navigation";

interface NavItemProps {
  item: NavItemType;
  isCollapsed: boolean;
  onClick?: () => void;
}

export function NavItem({ item, isCollapsed, onClick }: NavItemProps) {
  const pathname = usePathname();

  // Mark as active if the current path starts with the item's href.
  // Exact match for "/dashboard" to avoid it matching every sub-route.
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const Icon = item.icon;

  const linkContent = (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        // Base
        "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150",
        // Default state
        "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        // Active state
        isActive &&
          "bg-primary/10 text-primary border-l-2 border-primary ml-[-2px]",
        // Collapsed: centre the icon
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-colors",
          isActive ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
        )}
        aria-hidden="true"
      />
      {!isCollapsed && (
        <span className="truncate leading-none">{item.label}</span>
      )}
      {!isCollapsed && item.badge !== undefined && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={linkContent} />
        <TooltipContent side="right" sideOffset={8}>
          <span className="flex items-center gap-2">
            {item.label}
            {item.badge !== undefined && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                {item.badge}
              </span>
            )}
          </span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
