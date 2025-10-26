import { HttpResponse, http } from 'msw';

const mockBookmarks = [
  {
    children: [
      {
        dateAdded: Date.now(),
        id: '2',
        title: 'Test Bookmark',
        url: 'https://example.com',
      },
    ],
    id: '1',
    title: 'Test Folder',
  },
];

export const handlers = [
  http.get('/api/bookmarks', () => {
    return HttpResponse.json(mockBookmarks);
  }),

  http.get('/api/favicon', ({ request }) => {
    const url = new URL(request.url);
    const domain = url.searchParams.get('domain');
    return HttpResponse.json({
      favicon: `https://${domain}/favicon.ico`,
    });
  }),

  http.get('*', () => {
    return HttpResponse.json({ message: 'Mocked response' });
  }),
];
