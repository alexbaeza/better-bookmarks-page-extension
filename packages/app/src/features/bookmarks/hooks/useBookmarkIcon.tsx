import { Folder } from 'lucide-react';
import type React from 'react';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import { getDefaultFavicon } from '../lib/browser/utils/default-favicon';
import { useFavicon } from './useFavicon';

export const useBookmarkIcon = (url?: string, title?: string, size: 'sm' | 'md' | 'lg' = 'md'): React.ReactNode => {
  const faviconUrl = useFavicon(url);

  const sizeClasses = {
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-14',
  };

  return url ? (
    <ImageWithFallback
      alt={`favicon for ${title || 'bookmark'}`}
      className={`${sizeClasses[size]} rounded-sm`}
      fallback={getDefaultFavicon()}
      isFavicon={true}
      src={faviconUrl}
    />
  ) : (
    <Folder className="text-fgColor-secondary hover:text-fgColor-primary" fill="currentColor" size={size === 'sm' ? 16 : size === 'md' ? 28 : 32} />
  );
};
