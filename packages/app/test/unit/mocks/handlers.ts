import { http, HttpResponse } from 'msw';

const mockBookmarks = [
  {
    id: '1',
    title: 'Test Folder',
    children: [
      {
        id: '2',
        title: 'Test Bookmark',
        url: 'https://example.com',
        dateAdded: Date.now(),
      },
    ],
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


