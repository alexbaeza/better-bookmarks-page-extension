import { getFaviconUrl } from '@/features/bookmarks/lib/bookmarks';

export function useFavicon(url: string | undefined): string {
  if (!url) return '';
  return getFaviconUrl(url);
}
