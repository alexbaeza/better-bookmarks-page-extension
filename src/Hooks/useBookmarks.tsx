import { useEffect } from 'react';
import { useAppStateContext } from '../Context/app-state-context';

export const useBookmarks = () => {
  const {
    isLoading,
    error,
    providerInitialised,
    getBookmarks,
    bookmarks,
    currentPage,
    setCurrentPage,
    filteredData
  } = useAppStateContext();

  useEffect(() => {
    if (providerInitialised) {
      return;
    }
    getBookmarks();
    // eslint-disable-next-line
  }, []);

  return {
    bookmarks,
    currentPage,
    getBookmarks,
    setCurrentPage,
    filteredData,
    error,
    isLoading
  };
};
