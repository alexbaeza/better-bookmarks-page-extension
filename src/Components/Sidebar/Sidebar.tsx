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
    <>
      <div className="flex h-screen min-w-64 flex-col rounded-r-2xl bg-gray-700 text-white">
        <h1 className="mt-5 ml-5 text-xl font-bold">Better Bookmarks</h1>
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
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="mx-3 w-full border-b border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-700 px-4 text-xs text-gray-300">
              Folders
            </span>
          </div>
        </div>
        <ul className="h-full overflow-x-hidden overflow-auto">
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
        <div className="h-[1vh]  my-6 align-bottom flex">
          <Footer classname="justify-center"></Footer>
        </div>
      </div>
    </>
  );
};
