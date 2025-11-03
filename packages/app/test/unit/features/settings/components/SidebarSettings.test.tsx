import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach } from 'vitest';

import { SidebarSettings } from '@/features/settings/components/SidebarSettings';

describe('SidebarSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('When Sidebar toggle is disabled', () => {
    beforeEach(() => {
      localStorage.clear();
      localStorage.setItem('BB-sidebar-enabled', 'false');
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
      render(<SidebarSettings />);

      const checkbox = screen.getByTestId('sidebar-settings-toggle');
      fireEvent.click(checkbox);

      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('When Sidebar toggle is enabled', () => {
    beforeEach(() => {
      localStorage.clear();
      localStorage.setItem('BB-sidebar-enabled', 'true');
    });

    it('renders an enabled checkbox', () => {
      render(<SidebarSettings />);

      const checkbox = screen.getByTestId('sidebar-settings-toggle');
      expect(checkbox).toBeChecked();
    });

    it('toggles the checkbox state to disabled', () => {
      render(<SidebarSettings />);

      const checkbox = screen.getByTestId('sidebar-settings-toggle');
      fireEvent.click(checkbox);

      expect(checkbox).toBeInTheDocument();
    });
  });
});
