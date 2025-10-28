import type React from 'react';
import { createContext, useContext } from 'react';

export interface BookmarkDragContextValue {
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

const BookmarkDragContext = createContext<BookmarkDragContextValue | undefined>(undefined);

export const BookmarkDragProvider: React.FC<React.PropsWithChildren<BookmarkDragContextValue>> = ({ children, dragHandleProps }) => {
  return <BookmarkDragContext.Provider value={{ dragHandleProps }}>{children}</BookmarkDragContext.Provider>;
};

export function useBookmarkDragHandleProps(): BookmarkDragContextValue | undefined {
  return useContext(BookmarkDragContext);
}
