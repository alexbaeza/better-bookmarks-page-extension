export const APP_NAME = 'Better Bookmarks';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const STORAGE_KEYS = {
  THEME: 'better-bookmarks-theme',
  SETTINGS: 'better-bookmarks-settings',
  SIDEBAR_STATE: 'better-bookmarks-sidebar-state',
} as const;

export const DEFAULT_SETTINGS = {
  theme: 'light',
  sidebarCollapsed: false,
  viewMode: 'grid' as const,
  showGreeting: true,
} as const;

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
} as const;

export const BOOKMARK_TYPES = {
  FOLDER: 'folder',
  URL: 'url',
} as const;

export const DRAG_TYPES = {
  BOOKMARK: 'bookmark',
  FOLDER: 'folder',
} as const;
