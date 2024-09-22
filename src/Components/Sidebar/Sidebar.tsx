import { Footer } from '../Footer/Footer';
import React from 'react';
import { SidebarItemList, SidebarItemType } from './SidebarItemList';
import { useBookmarks } from '../../Hooks/useBookmarks';

export const Sidebar = () => {
  const {
    bookmarks: data,
    isLoading,
    currentPage,
    setCurrentPage
  } = useBookmarks();

  if (isLoading) {
    return <p>Loading</p>;
  }

  return (
    <div
      data-testid="sidebar"
      className="flex h-screen min-w-64 flex-col rounded-r-2xl bg-primary-dark-contrast/10 text-text-primary"
    >
      <h1 className="ml-5 mt-5 text-xl font-bold">Better Bookmarks</h1>
      <ul className="mt-10 text-sm">
        <SidebarItemList
          type={SidebarItemType.Item}
          isSelected={currentPage === 'All'}
          name={'All'}
          onClick={() => setCurrentPage('All')}
          counter={data.folders.length}
        />
        <SidebarItemList
          type={SidebarItemType.Item}
          isSelected={currentPage === 'Uncategorized'}
          name={'Uncategorized'}
          onClick={() => setCurrentPage('Uncategorized')}
          counter={data.uncategorized?.children?.length}
        />
      </ul>

      <div className="grid grid-cols-[1fr_auto_1fr] place-items-center gap-4 p-2">
        <span className="w-full border-y border-text-primary"></span>
        <h4 className="w-fit text-xs text-text-primary">Folders</h4>
        <span className="w-full border-y border-text-primary"></span>
      </div>

      <ul className="h-full overflow-auto overflow-x-hidden">
        {data.folders.map((item, key) => (
          <SidebarItemList
            type={SidebarItemType.Folder}
            key={'folder-nav-item-' + key}
            isSelected={currentPage === item.id}
            name={item.title}
            onClick={() => setCurrentPage(item.id)}
            counter={item?.children?.length}
          />
        ))}
      </ul>
      <div className="z-10 my-6 flex h-[1vh] align-bottom">
        <Footer classname="justify-center"></Footer>
      </div>
    </div>
  );
};
