export const mockBookmarks = [
  {
    id: '1',
    title: 'Test Bookmark',
    url: 'https://example.com',
    parentId: '0',
  },
  {
    id: '2',
    title: 'Another Bookmark',
    url: 'https://test.com',
    parentId: '0',
  },
];

export const mockFolders = [
  {
    id: 'folder1',
    title: 'Test Folder',
    children: [],
  },
];

export const mockUncategorized = {
  id: 'uncategorized',
  title: 'Uncategorized',
  children: mockBookmarks,
};
