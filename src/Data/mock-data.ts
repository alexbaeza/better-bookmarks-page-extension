import { IBookmarkItem } from '../Components/Bookmark/BookmarkFolderRoot';

export const mockData: IBookmarkItem[] = [
  {
    id: '0',
    title: '__root_',
    index: 0,
    dateAdded: 123456789,
    parentId: '0',
    children: [
      {
        id: '2',
        title: 'Folder 1',
        index: 2,
        dateAdded: 123456789,
        parentId: '0',
        children: [
          {
            id: '3',
            title: 'F1 Subfolder 1',
            index: 1,
            dateAdded: 123456789,
            parentId: '2',
            children: [
              {
                id: '4',
                title: 'F1 S1 Bookmark 1',
                index: 1,
                dateAdded: 123456789,
                parentId: '3',
                url: 'https://www.example.com/sub1'
              },
              {
                id: '5',
                title:
                  'VICE Video: Documentaries, Films, News Videos - VICE Video features the best original videos, documentaries, and underground news from around the world.',
                index: 2,
                dateAdded: 123456789,
                parentId: '3',
                url: 'https://www.example.com/sub2'
              }
            ]
          }
        ]
      },
      {
        id: '6',
        title: 'Folder 2',
        index: 6,
        dateAdded: 123456789,
        parentId: '0',
        children: [
          {
            id: '7',
            title: 'F1 Subfolder 1',
            index: 1,
            dateAdded: 123456789,
            parentId: '2',
            children: [
              {
                id: '8',
                title: 'F1 S1 Bookmark 1',
                index: 1,
                dateAdded: 123456789,
                parentId: '3',
                url: 'https://www.example.com/sub1'
              }
            ]
          },
          {
            id: '7',
            title: 'F1 Subfolder 1',
            index: 1,
            dateAdded: 123456789,
            parentId: '2',
            children: [
              {
                id: '7',
                title: 'F1 Subfolder 1',
                index: 1,
                dateAdded: 123456789,
                parentId: '2',
                children: [
                  {
                    id: '8',
                    title: 'F1 S1 Bookmark 1',
                    index: 1,
                    dateAdded: 123456789,
                    parentId: '3',
                    url: 'https://www.example.com/sub1'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
