"use client";

/**
 * SidebarContext — shared state for the dashboard sidebar.
 *
 * Manages two independent states:
 *  • isCollapsed — desktop/tablet icon-only mode (persisted to localStorage)
 *  • isMobileOpen — mobile drawer open/close state (transient)
 *
 * Both the Sidebar and the Header hamburger button read from / write to this
 * context, allowing them to communicate without prop drilling through
 * DashboardLayout.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { STORAGE_KEYS } from "@/constants/storageKeys";

interface SidebarContextValue {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapsed: () => {},
  openMobile: () => {},
  closeMobile: () => {},
});

export function useSidebar(): SidebarContextValue {
  return useContext(SidebarContext);
}

interface SidebarProviderProps {
  children: React.ReactNode;
}

// Read persisted collapsed state once on the client
function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === "true";
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(readCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(next));
      return next;
    });
  }, []);

  const openMobile = useCallback(() => setIsMobileOpen(true), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, isMobileOpen, toggleCollapsed, openMobile, closeMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
