import { type ImgHTMLAttributes, useState } from 'react';

import { getDefaultFavicon } from '@/features/bookmarks/lib/browser/utils/default-favicon';

export interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: string;
  alt: string;
}

export const ImageWithFallback = ({ fallback = getDefaultFavicon(), src, alt, className = '', ...props }: ImageWithFallbackProps) => {
  const [hasError, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  return (
    <img
      {...props}
      alt={alt}
      src={hasError ? fallback : src}
      onLoad={handleLoad}
      onError={handleError}
      className={`${className} ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`}
    />
  );
};
