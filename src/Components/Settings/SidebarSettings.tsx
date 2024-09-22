import React from 'react';
import { useAtom } from 'jotai';
import { sidebarEnabledAtom } from '../../Context/atoms';
interface GreetingSettingsProps {
  dataTestId?: string;
}

export const SidebarSettings = ({ dataTestId }: GreetingSettingsProps) => {
  const [sidebarEnabled, setSidebarEnabled] = useAtom(sidebarEnabledAtom);

  return (
    <div
      data-testid={dataTestId}
      className="my-2 flex items-center justify-between"
    >
      <span className="text-sm font-bold text-text-primary">
        Enable Sidebar?
      </span>
      <div className="flex items-center rounded-lg bg-secondary-dark p-1">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            data-testid="greeting-settings-toggle"
            onClick={() => setSidebarEnabled(!sidebarEnabled)}
            type="checkbox"
            value=""
            className="peer sr-only"
            defaultChecked={sidebarEnabled}
          />
          <div className="peer h-6 w-11 rounded-full border-primary-dark bg-primary-dark-active after:absolute after:left-[2px] after:top-0.5 after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-accent"></div>
        </label>
      </div>
    </div>
  );
};
