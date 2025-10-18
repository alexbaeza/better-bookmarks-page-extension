export interface IBookmarkItem {
  id: string;
  title: string;
  index?: number;
  dateAdded?: number;
  dateGroupModified?: number;
  parentId?: string;
  url?: string;
  children?: IBookmarkItem[];
}

export interface BookmarkFolderRootProps {
  folderId: string;
  name: string;
  folderContents: IBookmarkItem[];
}

export interface BookmarkContentRendererProps {
  folderContents: IBookmarkItem[];
  folderId: string;
}

export interface BookmarkFormModalProps {
  onClose: () => void;
  onSave: (values: { title: string; url?: string }) => void;
  initialValues?: { title: string; url?: string };
}

export interface BookmarkFolderModalProps {
  dataTestId?: string;
  item: IBookmarkItem;
  folderContents: IBookmarkItem[];
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export interface RenderFoldersProps {
  folders: IBookmarkItem[];
}
