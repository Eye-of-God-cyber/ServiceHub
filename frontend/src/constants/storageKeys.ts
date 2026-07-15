/**
 * Keys used to read/write values in localStorage or sessionStorage.
 * Keeping them centralised prevents key-name typos across the codebase.
 */

export const STORAGE_KEYS = {
  /** JWT access token issued by the backend on login / register */
  AUTH_TOKEN: "servicehub_auth_token",

  /** Serialised user object cached after successful auth */
  USER: "servicehub_user",

  /** Theme preference – 'light' | 'dark' | 'system' */
  THEME: "servicehub_theme",

  /** Most-recently viewed category id (for catalog UX) */
  LAST_CATEGORY: "servicehub_last_category",

  /** Sidebar collapsed preference ('true' | 'false') */
  SIDEBAR_COLLAPSED: "servicehub_sidebar_collapsed",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
