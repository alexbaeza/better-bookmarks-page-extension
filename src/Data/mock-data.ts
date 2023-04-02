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
            id: '12',
            title: 'F1 Bookmark 1',
            index: 12,
            dateAdded: 123456789,
            parentId: '2',
            url: 'https://www.example.com/sub1'
          },
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
                title: 'F1 S1 1 Bookmark 2',
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
            id: '13',
            title: 'F2 Bookmark 1',
            index: 12,
            dateAdded: 123456789,
            parentId: '0',
            url: 'https://www.example.com/sub1'
          },
          {
            id: '7',
            title: 'F2 Subfolder 1',
            index: 7,
            dateAdded: 123456789,
            parentId: '6',
            children: [
              {
                id: '8',
                title: 'F2 S1 Bookmark 1',
                index: 8,
                dateAdded: 123456789,
                parentId: '7',
                url: 'https://www.example.com/sub1'
              }
            ]
          },
          {
            id: '9',
            title: 'Folder 3',
            index: 9,
            dateAdded: 123456789,
            parentId: '6',
            children: [
              {
                id: '10',
                title: 'F3 Subfolder 1',
                index: 1,
                dateAdded: 123456789,
                parentId: '9',
                children: [
                  {
                    id: '11',
                    title: 'F3 S1 Bookmark 1',
                    index: 11,
                    dateAdded: 123456789,
                    parentId: '9',
                    url: 'https://www.example.com/sub1'
                  },
                  {
                    id: '12',
                    title: 'F3 S1 Bookmark 2',
                    index: 12,
                    dateAdded: 123456789,
                    parentId: '9',
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
