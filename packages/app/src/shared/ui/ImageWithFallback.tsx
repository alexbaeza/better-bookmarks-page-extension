import { type ImgHTMLAttributes, useEffect, useState } from 'react';
import { getDefaultFavicon } from '@/features/bookmarks/lib/browser/utils/default-favicon';
import { faviconCache } from '@/features/bookmarks/lib/favicon-cache';

export interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: string;
  alt: string;
  isFavicon?: boolean; // Whether this is a favicon that should use caching
}

export const ImageWithFallback = ({
  fallback = getDefaultFavicon(),
  src,
  alt,
  className = '',
  isFavicon = false,
  ...props
}: ImageWithFallbackProps) => {
  const [hasError, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actualSrc, setActualSrc] = useState<string>(src);

  useEffect(() => {
    // Reset state when src changes
    setError(false);
    setIsLoading(true);
    setActualSrc(src);
  }, [src]);

  useEffect(() => {
    if (!isFavicon || !src) {
      setActualSrc(src);
      return;
    }

    // Check cache status for favicons
    const cacheStatus = faviconCache.getStatus(src);

    if (cacheStatus === 'failed') {
      // If we know this favicon failed recently, skip loading and use fallback
      setError(true);
      setIsLoading(false);
      setActualSrc(fallback);
      return;
    }

    // Set the actual source (browser HTTP cache will handle already-loaded favicons)
    setActualSrc(src);

    // Mark as loading if not already marked
    if (cacheStatus !== 'loading' && cacheStatus !== 'loaded') {
      faviconCache.markLoading(src);
    } else if (cacheStatus === 'loaded') {
      // If already loaded, browser cache should handle it quickly
      // But we still need to let it load naturally to track state
    }
  }, [src, fallback, isFavicon]);

  const handleLoad = () => {
    setIsLoading(false);
    if (isFavicon && src) {
      faviconCache.markLoaded(src);
    }
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    if (isFavicon && src) {
      faviconCache.markFailed(src);
      setActualSrc(fallback);
    }
  };

  return (
    <img
      {...props}
      alt={alt}
      className={`${className} ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`}
      onError={handleError}
      onLoad={handleLoad}
      src={hasError ? fallback : actualSrc}
    />
  );
};
