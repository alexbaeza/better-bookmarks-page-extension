import { GridIcon, ListIcon } from '../Components/IconButton/Icons/Icons';
import { BookmarkDisplayMode } from '../types.d';
import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { viewModeAtom } from '../Context/atoms';

export const ViewModeToggle = () => {
  const viewMode = useAtomValue(viewModeAtom);
  const setViewMode = useSetAtom(viewModeAtom);
  const toggleViewMode = () => {
    if (viewMode === BookmarkDisplayMode.Grid) {
      setViewMode(BookmarkDisplayMode.List);
    } else if (viewMode === BookmarkDisplayMode.List) {
      setViewMode(BookmarkDisplayMode.Grid);
    }
  };

  return (
    <div className="mr-2 flex flex-row justify-end">
      <div className="my-3 flex justify-between rounded-lg bg-secondary-dark p-2">
        <ListIcon dataTestId="list-icon" className="mr-2 text-text-primary" />
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            data-testid="view-mode-toggle"
            onClick={() => toggleViewMode()}
            type="checkbox"
            checked={viewMode === BookmarkDisplayMode.Grid}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full border-primary-dark bg-primary-dark-active after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-accent"></div>
        </label>
        <GridIcon dataTestId="grid-icon" className="ml-2 text-text-primary" />
      </div>
    </div>
  );
};
