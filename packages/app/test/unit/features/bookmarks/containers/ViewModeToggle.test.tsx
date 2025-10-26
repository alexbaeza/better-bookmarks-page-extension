import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { viewModeAtom } from '@/app/providers/atoms';
import { ViewModeToggle } from '@/features/bookmarks/containers/ViewModeToggle';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { AllProviders } from '~test/test-utils';

describe('ViewModeToggle', () => {
  describe('when viewMode is List', () => {
    it('renders the component with list mode active', () => {
      render(
        <AllProviders initialValues={[[viewModeAtom, BookmarkDisplayMode.List]]}>
          <ViewModeToggle />
        </AllProviders>
      );

      expect(screen.getByTestId('view-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('list-icon')).toBeInTheDocument();
      expect(screen.getByTestId('grid-icon')).toBeInTheDocument();
      expect(screen.getByTestId('view-toggle')).not.toBeChecked();
    });

    it('switches to Grid mode when toggle is clicked', async () => {
      const user = userEvent.setup();

      render(
        <AllProviders initialValues={[[viewModeAtom, BookmarkDisplayMode.List]]}>
          <ViewModeToggle />
        </AllProviders>
      );

      const toggle = screen.getByTestId('view-toggle');
      await user.click(toggle);

      expect(screen.getByTestId('view-toggle')).toBeChecked();
    });
  });

  describe('when viewMode is Grid', () => {
    it('renders the component with grid mode active', () => {
      render(
        <AllProviders initialValues={[[viewModeAtom, BookmarkDisplayMode.Grid]]}>
          <ViewModeToggle />
        </AllProviders>
      );

      expect(screen.getByTestId('view-toggle')).toBeChecked();
    });

    it('switches to List mode when toggle is clicked', async () => {
      const user = userEvent.setup();

      render(
        <AllProviders initialValues={[[viewModeAtom, BookmarkDisplayMode.Grid]]}>
          <ViewModeToggle />
        </AllProviders>
      );

      const toggle = screen.getByTestId('view-toggle');
      await user.click(toggle);

      expect(screen.getByTestId('view-toggle')).not.toBeChecked();
    });
  });
});
