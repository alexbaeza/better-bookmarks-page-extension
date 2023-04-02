import { GridIcon, ListIcon } from '../Components/IconButton/Icons/Icons';
import { BookmarkDisplayMode } from '../types.d';
import React from 'react';
import { useAtom } from 'jotai';
import { viewModeAtom } from '../Context/atoms';

export const ViewModeToggle = () => {
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const toggleViewMode = () => {
    if (viewMode === BookmarkDisplayMode.Grid) {
      setViewMode(BookmarkDisplayMode.List);
    } else {
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
            value=""
            className="peer sr-only"
            defaultChecked={viewMode === BookmarkDisplayMode.Grid}
          />
          <div className="peer h-6 w-11 rounded-full border-gray-600 bg-gray-700 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-accent"></div>
        </label>
        <GridIcon dataTestId="grid-icon" className="ml-2 text-text-primary" />
      </div>
    </div>
  );
};
