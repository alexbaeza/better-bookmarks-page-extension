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

export interface BookmarkFormModalProps {
  onClose: () => void;
  onSave: (values: { title: string; url?: string }) => void;
  initialValues?: { title: string; url?: string };
}
