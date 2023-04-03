import { useEffect, useState } from 'react';
import { Bookmarks } from '../Data/bookmarks';
import { IBookmarkItem } from '../Components/Bookmark/BookmarkFolderRoot';

export const useBookmarks = () => {
  const [data, setData] = useState<IBookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      Bookmarks.getFolders()
        .then((response) => setData(response))
        .catch((err) => console.error(err));
      setLoading(false);
    };

    fetchData();
  }, []);

  return {
    data,
    loading
  };
};
