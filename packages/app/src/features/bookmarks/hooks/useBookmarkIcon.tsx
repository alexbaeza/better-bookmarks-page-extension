import { Folder } from 'lucide-react';
import type React from 'react';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import { getDefaultFavicon } from '../lib/browser/utils/default-favicon';
import { useFavicon } from './useFavicon';

export const useBookmarkIcon = (url?: string, size: 'sm' | 'md' | 'lg' = 'md'): React.ReactNode => {
  const faviconUrl = useFavicon(url);

  const sizeClasses = {
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-14',
  };

  const getFolderIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'md':
        return 28;
      case 'lg':
        return 32;
      default:
        return 28;
    }
  };

  if (url) {
    return (
      <ImageWithFallback
        alt="favicon"
        className={`${sizeClasses[size]} rounded-sm`}
        fallback={getDefaultFavicon()}
        isFavicon={true}
        src={faviconUrl}
      />
    );
  }

  return (
    <Folder
      className="text-fgColor-secondary hover:text-fgColor-primary"
      fill="currentColor"
      size={getFolderIconSize()}
    />
  );
};
