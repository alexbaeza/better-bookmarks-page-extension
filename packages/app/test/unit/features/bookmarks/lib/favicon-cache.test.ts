import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { faviconCache } from '@/features/bookmarks/lib/favicon-cache';

describe('faviconCache', () => {
  beforeEach(() => {
    faviconCache.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    faviconCache.clear();
    vi.useRealTimers();
  });

  it('should return true for new URL', () => {
    expect(faviconCache.shouldLoad('https://example.com')).toBe(true);
  });

  it('should return false for loaded URL within TTL', () => {
    faviconCache.markLoaded('https://example.com');
    expect(faviconCache.shouldLoad('https://example.com')).toBe(false);
  });

  it('should return false for failed URL within TTL', () => {
    faviconCache.markFailed('https://example.com');
    expect(faviconCache.shouldLoad('https://example.com')).toBe(false);
  });

  it('should return true for expired loaded URL', () => {
    faviconCache.markLoaded('https://example.com');
    vi.advanceTimersByTime(25 * 60 * 60 * 1000); // 25 hours
    expect(faviconCache.shouldLoad('https://example.com')).toBe(true);
  });

  it('should return true for expired failed URL', () => {
    faviconCache.markFailed('https://example.com');
    vi.advanceTimersByTime(2 * 60 * 60 * 1000); // 2 hours
    expect(faviconCache.shouldLoad('https://example.com')).toBe(true);
  });

  it('should mark URL as loading', () => {
    faviconCache.markLoading('https://example.com');
    expect(faviconCache.getStatus('https://example.com')).toBe('loading');
  });

  it('should mark URL as loaded', () => {
    faviconCache.markLoaded('https://example.com');
    expect(faviconCache.getStatus('https://example.com')).toBe('loaded');
  });

  it('should mark URL as failed', () => {
    faviconCache.markFailed('https://example.com');
    expect(faviconCache.getStatus('https://example.com')).toBe('failed');
  });

  it('should return null for non-existent URL', () => {
    expect(faviconCache.getStatus('https://example.com')).toBe(null);
  });

  it('should return null for expired entry', () => {
    faviconCache.markLoaded('https://example.com');
    vi.advanceTimersByTime(25 * 60 * 60 * 1000); // 25 hours
    expect(faviconCache.getStatus('https://example.com')).toBe(null);
  });

  it('should store and retrieve loading promise', () => {
    const promise = Promise.resolve(true);
    faviconCache.setLoadingPromise('https://example.com', promise);
    expect(faviconCache.getLoadingPromise('https://example.com')).toBe(promise);
  });

  it('should mark loaded when promise resolves with true', async () => {
    const promise = Promise.resolve(true);
    faviconCache.setLoadingPromise('https://example.com', promise);
    await promise;
    await vi.runAllTimersAsync();
    expect(faviconCache.getStatus('https://example.com')).toBe('loaded');
  });

  it('should mark failed when promise resolves with false', async () => {
    const promise = Promise.resolve(false);
    faviconCache.setLoadingPromise('https://example.com', promise);
    await promise;
    await vi.runAllTimersAsync();
    expect(faviconCache.getStatus('https://example.com')).toBe('failed');
  });

  it('should mark failed when promise rejects', async () => {
    const promise = Promise.reject(new Error('Failed'));
    faviconCache.setLoadingPromise('https://example.com', promise);
    await promise.catch(() => {});
    await vi.runAllTimersAsync();
    expect(faviconCache.getStatus('https://example.com')).toBe('failed');
  });

  it('should clear expired entries', () => {
    faviconCache.markLoaded('https://example.com');
    faviconCache.markLoaded('https://test.com');
    vi.advanceTimersByTime(25 * 60 * 60 * 1000); // 25 hours
    faviconCache.clearExpired();
    expect(faviconCache.getStatus('https://example.com')).toBe(null);
    expect(faviconCache.getStatus('https://test.com')).toBe(null);
  });

  it('should clear all entries', () => {
    faviconCache.markLoaded('https://example.com');
    faviconCache.markFailed('https://test.com');
    faviconCache.clear();
    expect(faviconCache.getStatus('https://example.com')).toBe(null);
    expect(faviconCache.getStatus('https://test.com')).toBe(null);
  });

  it('should clear loading promises on clear', () => {
    const promise = Promise.resolve(true);
    faviconCache.setLoadingPromise('https://example.com', promise);
    faviconCache.clear();
    expect(faviconCache.getLoadingPromise('https://example.com')).toBeUndefined();
  });
});
