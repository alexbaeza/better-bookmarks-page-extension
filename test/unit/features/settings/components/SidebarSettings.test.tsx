import { fireEvent, render, screen } from '@testing-library/react';
import * as jotai from 'jotai';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { sidebarEnabledAtom } from '@/app/providers/atoms';
import { SidebarSettings } from '@/features/settings/components/SidebarSettings';

describe('SidebarSettings', () => {
  let spy: vi.SpyInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    spy = vi.spyOn(jotai, 'useAtom');
  });

  describe('When Sidebar toggle is disabled', () => {
    beforeEach(() => {
      when(spy)
        .calledWith(sidebarEnabledAtom)
        .thenReturn([false, vi.fn() as never]);
    });

    it('renders the component', () => {
      const dataTestId = 'sidebar-settings';
      render(<SidebarSettings dataTestId={dataTestId} />);
      const sidebarToggle = screen.getByTestId('sidebar-settings-toggle');
      expect(sidebarToggle).not.toBeChecked();
      const sidebarSettingsTitle = screen.getByText('Enable Sidebar');
      expect(sidebarSettingsTitle).toBeInTheDocument();
      expect(sidebarToggle).toBeInTheDocument();
    });

    it('renders with the correct test id', () => {
      const dataTestId = 'sidebar-settings';
      render(<SidebarSettings dataTestId={dataTestId} />);
      const sidebarSettingsDiv = screen.getByTestId(dataTestId);
      expect(sidebarSettingsDiv).toBeInTheDocument();
    });

    it('toggles the checkbox state to enabled', () => {
      const setSidebarEnabledMock = vi.fn();
      when(spy).calledWith(sidebarEnabledAtom).thenReturn([false, setSidebarEnabledMock]);

      render(<SidebarSettings />);
      const checkbox = screen.getByTestId('sidebar-settings-toggle');
      fireEvent.click(checkbox);

      expect(setSidebarEnabledMock).toHaveBeenCalledTimes(1);
      expect(setSidebarEnabledMock).toHaveBeenCalledWith(true);
    });
  });

  describe('When Sidebar toggle is enabled', () => {
    beforeEach(() => {
      when(spy)
        .calledWith(sidebarEnabledAtom)
        .thenReturn([true, vi.fn() as never]);
    });

    it('renders an enabled checkbox', () => {
      render(<SidebarSettings />);
      const checkbox = screen.getByTestId('sidebar-settings-toggle');
      expect(checkbox).toBeChecked();
    });

    it('toggles the checkbox state to disabled', () => {
      const setSidebarEnabledMock = vi.fn();
      when(spy).calledWith(sidebarEnabledAtom).thenReturn([true, setSidebarEnabledMock]);

      render(<SidebarSettings />);
      const checkbox = screen.getByTestId('sidebar-settings-toggle');
      fireEvent.click(checkbox);

      expect(setSidebarEnabledMock).toHaveBeenCalledTimes(1);
      expect(setSidebarEnabledMock).toHaveBeenCalledWith(false);
    });
  });
});
