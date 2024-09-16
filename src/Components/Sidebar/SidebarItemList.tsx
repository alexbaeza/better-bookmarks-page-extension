import React from 'react';
import { FolderIcon } from '../IconButton/Icons/Icons';

export enum SidebarItemType {
  // eslint-disable-next-line no-unused-vars
  Folder,
  // eslint-disable-next-line no-unused-vars
  Item
}

const ItemIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

export const SidebarItemList = ({
  isSelected = false,
  name,
  onClick,
  type,
  counter = 0
}: {
  isSelected: boolean;
  name: string;
  onClick?: () => void;
  type: SidebarItemType;
  counter?: number;
}) => {
  const bgColor = isSelected ? 'bg-slate-600' : '';
  return (
    <>
      <li
        className={`relative flex cursor-pointer space-x-2 rounded-md py-2 px-5 text-gray-300 hover:bg-slate-600 ${bgColor}`}
        onClick={onClick}
      >
        {/*{type === SidebarItemType.Folder && */}
        {/*"  <FolderIcon dataTestId="folder-icon" size={'sm'} />"*/}
        {/*}*/}
        {type === SidebarItemType.Item && ItemIcon}
        {type === SidebarItemType.Folder && (
          <FolderIcon dataTestId="folder-icon" size={'sm'} />
        )}
        <span className="text-sm">{name}</span>
        <span className="min-w-8 flex w-8 items-center justify-center rounded-xl bg-accent text-xs font-bold text-teal-50">
          {counter}
        </span>
        {isSelected && (
          <svg
            className="absolute -top-1/2 -right-2 h-20 w-8 text-primary-dark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="399.349 57.696 100.163 402.081"
            width="1em"
            height="4em"
          >
            <path
              fill="currentColor"
              d="M 499.289 57.696 C 499.289 171.989 399.349 196.304 399.349 257.333 C 399.349 322.485 499.512 354.485 499.512 458.767 C 499.512 483.155 499.289 57.696 499.289 57.696 Z"
            />
          </svg>
        )}
      </li>
    </>
  );
};
