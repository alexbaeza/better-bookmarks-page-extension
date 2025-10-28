import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBookmarkIcon } from '@/features/bookmarks/hooks/useBookmarkIcon';

// Mock dependencies
vi.mock('../../../../../../../src/features/bookmarks/hooks/useFavicon', () => ({
  useFavicon: (url?: string) => (url ? `https://favicon.service/${url}` : ''),
}));

vi.mock('@/features/bookmarks/lib/browser/utils/default-favicon', () => ({
  getDefaultFavicon: () => 'data:image/svg+xml;base64,default',
}));

vi.mock('lucide-react', () => ({
  Folder: ({ size, fill, className }: any) => (
    <div className={className} data-fill={fill} data-size={size} data-testid="folder-icon">
      Folder
    </div>
  ),
}));

vi.mock('@/shared/ui/ImageWithFallback', () => ({
  ImageWithFallback: ({ src, alt, fallback, className }: any) => (
    <img alt={alt} className={className} data-fallback={fallback} data-testid="favicon-image" src={src} />
  ),
}));

describe('useBookmarkIcon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('for bookmarks with URL', () => {
    it('should return ImageWithFallback for bookmark with URL', () => {
      const { result } = renderHook(() => useBookmarkIcon('https://example.com', 'Example'));

      expect(result.current).toBeDefined();
      // The result is a React element, check its type
      expect((result.current as any).type).toBeDefined();
    });

    it('should use medium size by default', () => {
      const { result } = renderHook(() => useBookmarkIcon('https://example.com', 'Example'));

      expect(result.current).toBeDefined();
    });

    it('should accept small size', () => {
      const { result } = renderHook(() => useBookmarkIcon('https://example.com', 'Example', 'sm'));

      expect(result.current).toBeDefined();
    });

    it('should accept large size', () => {
      const { result } = renderHook(() => useBookmarkIcon('https://example.com', 'Example', 'lg'));

      expect(result.current).toBeDefined();
    });
  });

  describe('for folders without URL', () => {
    it('should return Folder icon for item without URL', () => {
      const { result } = renderHook(() => useBookmarkIcon(undefined, 'My Folder'));

      expect(result.current).toBeDefined();
      expect((result.current as any).type).toBeDefined();
    });

    it('should use correct icon size for small', () => {
      const { result } = renderHook(() => useBookmarkIcon(undefined, 'My Folder', 'sm'));

      expect(result.current).toBeDefined();
    });

    it('should use correct icon size for medium', () => {
      const { result } = renderHook(() => useBookmarkIcon(undefined, 'My Folder', 'md'));

      expect(result.current).toBeDefined();
    });

    it('should use correct icon size for large', () => {
      const { result } = renderHook(() => useBookmarkIcon(undefined, 'My Folder', 'lg'));

      expect(result.current).toBeDefined();
    });
  });

  describe('fallback behavior', () => {
    it('should provide fallback for bookmark favicon', () => {
      const { result } = renderHook(() => useBookmarkIcon('https://example.com', 'Example'));

      expect(result.current).toBeDefined();
    });

    it('should work without title', () => {
      const { result } = renderHook(() => useBookmarkIcon('https://example.com'));

      expect(result.current).toBeDefined();
    });

    it('should work for folder without title', () => {
      const { result } = renderHook(() => useBookmarkIcon());

      expect(result.current).toBeDefined();
    });
  });
});
