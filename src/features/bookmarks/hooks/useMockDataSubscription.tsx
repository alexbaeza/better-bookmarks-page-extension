import { useEffect, useState } from 'react';

import type { IBookmarkItem } from '@/shared/types/bookmarks';

import { mockDataService } from '../lib/browser/api/mock-data-service';

/**
 * Hook that subscribes to mock data changes and triggers re-renders
 * This simulates the real browser behavior where API operations cause re-renders
 */
export function useMockDataSubscription(): IBookmarkItem[] {
  const [data, setData] = useState<IBookmarkItem[]>(mockDataService.getData());

  useEffect(() => {
    // Subscribe to data changes
    const unsubscribe = mockDataService.subscribe(() => {
      setData(mockDataService.getData());
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  return data;
}
