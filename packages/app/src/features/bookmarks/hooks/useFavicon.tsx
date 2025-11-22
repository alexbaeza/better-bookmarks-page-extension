import { getFaviconUrl } from '@/features/bookmarks/lib/bookmarks';

export const useFavicon = (url: string | undefined): string => {
  if (!url) return '';
  return getFaviconUrl(url);
};
