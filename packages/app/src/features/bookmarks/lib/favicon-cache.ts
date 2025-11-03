/**
 * Favicon cache service to prevent unnecessary network requests
 * Tracks loaded and failed favicon URLs to avoid redundant fetches
 */

interface FaviconCacheEntry {
  url: string;
  status: 'loading' | 'loaded' | 'failed';
  timestamp: number;
}

class FaviconCache {
  private cache = new Map<string, FaviconCacheEntry>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly FAILED_CACHE_TTL = 60 * 60 * 1000; // 1 hour for failed requests
  private loadingPromises = new Map<string, Promise<boolean>>();

  /**
   * Check if a favicon URL should be loaded
   * Returns false if the URL is cached and still valid
   */
  shouldLoad(url: string): boolean {
    const entry = this.cache.get(url);

    if (!entry) {
      return true;
    }

    const now = Date.now();
    const age = now - entry.timestamp;
    const ttl = entry.status === 'failed' ? this.FAILED_CACHE_TTL : this.CACHE_TTL;

    // Return false if cached entry is still valid
    if (age < ttl) {
      return entry.status !== 'loaded' && entry.status !== 'failed';
    }

    // Entry expired, remove it
    this.cache.delete(url);
    return true;
  }

  /**
   * Mark a favicon URL as loading
   */
  markLoading(url: string): void {
    this.cache.set(url, {
      status: 'loading',
      timestamp: Date.now(),
      url,
    });
  }

  /**
   * Mark a favicon URL as successfully loaded
   */
  markLoaded(url: string): void {
    this.cache.set(url, {
      status: 'loaded',
      timestamp: Date.now(),
      url,
    });
    this.loadingPromises.delete(url);
  }

  /**
   * Mark a favicon URL as failed to load
   */
  markFailed(url: string): void {
    this.cache.set(url, {
      status: 'failed',
      timestamp: Date.now(),
      url,
    });
    this.loadingPromises.delete(url);
  }

  /**
   * Get the cache status for a URL
   */
  getStatus(url: string): 'loading' | 'loaded' | 'failed' | null {
    const entry = this.cache.get(url);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;
    const ttl = entry.status === 'failed' ? this.FAILED_CACHE_TTL : this.CACHE_TTL;

    if (age >= ttl) {
      // Entry expired
      this.cache.delete(url);
      return null;
    }

    return entry.status;
  }

  /**
   * Check if there's an ongoing load promise for a URL
   */
  getLoadingPromise(url: string): Promise<boolean> | undefined {
    return this.loadingPromises.get(url);
  }

  /**
   * Set a loading promise for a URL to prevent duplicate requests
   */
  setLoadingPromise(url: string, promise: Promise<boolean>): void {
    this.loadingPromises.set(url, promise);
    promise
      .then((success) => {
        if (success) {
          this.markLoaded(url);
        } else {
          this.markFailed(url);
        }
      })
      .catch(() => {
        this.markFailed(url);
      });
  }

  /**
   * Clear expired entries from cache
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [url, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      const ttl = entry.status === 'failed' ? this.FAILED_CACHE_TTL : this.CACHE_TTL;
      if (age >= ttl) {
        this.cache.delete(url);
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

// Singleton instance
export const faviconCache = new FaviconCache();

// Clean up expired entries periodically (every hour)
if (typeof window !== 'undefined') {
  setInterval(
    () => {
      faviconCache.clearExpired();
    },
    60 * 60 * 1000
  );
}
