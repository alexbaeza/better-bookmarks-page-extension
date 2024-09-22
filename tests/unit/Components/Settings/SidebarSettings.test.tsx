import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarSettings } from '../../../../src/Components/Settings/SidebarSettings';
import { sidebarEnabledAtom } from '../../../../src/Context/atoms';
import { when } from 'jest-when';
import * as jotai from 'jotai';

describe('SidebarSettings', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest.spyOn(jotai, 'useAtom');
  });

  describe('When Sidebar toggle is disabled', () => {
    beforeEach(() => {
      when(spy)
        .calledWith(sidebarEnabledAtom)
        .mockReturnValue([false, jest.fn() as never]);
    });

    it('renders the component', () => {
      const dataTestId = 'sidebar-settings';
      render(<SidebarSettings dataTestId={dataTestId} />);
      const sidebarToggle = screen.getByTestId('greeting-settings-toggle');
      expect(sidebarToggle).not.toBeChecked();
      const sidebarSettingsTitle = screen.getByText('Enable Sidebar?');
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
      const setSidebarEnabledMock = jest.fn();
      when(spy)
        .calledWith(sidebarEnabledAtom)
        .mockReturnValue([false, setSidebarEnabledMock]);

      render(<SidebarSettings />);
      const checkbox = screen.getByTestId('greeting-settings-toggle');
      fireEvent.click(checkbox);

      expect(setSidebarEnabledMock).toHaveBeenCalledTimes(1);
      expect(setSidebarEnabledMock).toHaveBeenCalledWith(true);
    });
  });

  describe('When Sidebar toggle is enabled', () => {
    beforeEach(() => {
      when(spy)
        .calledWith(sidebarEnabledAtom)
        .mockReturnValue([true, jest.fn() as never]);
    });

    it('renders an enabled checkbox', () => {
      render(<SidebarSettings />);
      const checkbox = screen.getByTestId('greeting-settings-toggle');
      expect(checkbox).toBeChecked();
    });

    it('toggles the checkbox state to disabled', () => {
      const setSidebarEnabledMock = jest.fn();
      when(spy)
        .calledWith(sidebarEnabledAtom)
        .mockReturnValue([true, setSidebarEnabledMock]);

      render(<SidebarSettings />);
      const checkbox = screen.getByTestId('greeting-settings-toggle');
      fireEvent.click(checkbox);

      expect(setSidebarEnabledMock).toHaveBeenCalledTimes(1);
      expect(setSidebarEnabledMock).toHaveBeenCalledWith(false);
    });
  });
});
