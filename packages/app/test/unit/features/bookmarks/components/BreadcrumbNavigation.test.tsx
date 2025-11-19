import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';
import { BreadcrumbNavigation } from '@/features/bookmarks/components/BreadcrumbNavigation';
import { AllProviders } from '~test/test-utils';

const mockNavigateToPage = vi.fn();
const mockNavigateBack = vi.fn();
const mockUseBookmarkNavigation = vi.fn();
const mockUseBookmarks = vi.fn();

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', () => ({
  useBookmarkNavigation: () => mockUseBookmarkNavigation(),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: () => mockUseBookmarks(),
}));

describe('BreadcrumbNavigation', () => {
  beforeEach(() => {
    mockNavigateToPage.mockClear();
    mockNavigateBack.mockClear();
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        navigationStack: ['All', 'folder-1'],
        navigateToPage: mockNavigateToPage,
        navigateBack: mockNavigateBack,
        canGoBack: true,
      });
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        rawFolders: [
          {
            id: 'folder-1',
            title: 'Test Folder',
            children: [],
          },
        ],
      });
  });

  it('should render back button when canGoBack is true', () => {
    render(
      <AllProviders>
        <BreadcrumbNavigation />
      </AllProviders>
    );
    expect(screen.getByTestId('breadcrumb-back')).toBeInTheDocument();
  });

  it('should render breadcrumb items', () => {
    render(
      <AllProviders>
        <BreadcrumbNavigation />
      </AllProviders>
    );
    expect(screen.getByTestId('breadcrumb-item-All')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-item-folder-1')).toBeInTheDocument();
  });

  it('should call navigateToPage when breadcrumb item is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AllProviders>
        <BreadcrumbNavigation />
      </AllProviders>
    );

    const breadcrumbItem = screen.getByTestId('breadcrumb-item-All');
    await user.click(breadcrumbItem);

    expect(mockNavigateToPage).toHaveBeenCalledWith('All');
  });

  it('should call navigateBack when back button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AllProviders>
        <BreadcrumbNavigation />
      </AllProviders>
    );

    const backButton = screen.getByTestId('breadcrumb-back');
    await user.click(backButton);

    expect(mockNavigateBack).toHaveBeenCalled();
  });

  it('should render Home icon for first item', () => {
    render(
      <AllProviders>
        <BreadcrumbNavigation />
      </AllProviders>
    );
    const firstItem = screen.getByTestId('breadcrumb-item-All');
    expect(firstItem.querySelector('svg')).toBeInTheDocument();
  });

  it('should render All Bookmarks for All page', () => {
    render(
      <AllProviders>
        <BreadcrumbNavigation />
      </AllProviders>
    );
    expect(screen.getByText('All Bookmarks')).toBeInTheDocument();
  });

  it('should render folder title', () => {
    render(
      <AllProviders>
        <BreadcrumbNavigation />
      </AllProviders>
    );
    expect(screen.getByText('Test Folder')).toBeInTheDocument();
  });

  it('should show ellipsis when path length exceeds 5', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        navigationStack: ['All', 'folder-1', 'folder-2', 'folder-3', 'folder-4', 'folder-5', 'folder-6'],
        navigateToPage: mockNavigateToPage,
        navigateBack: mockNavigateBack,
        canGoBack: true,
      });

    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        rawFolders: [
          { id: 'folder-1', title: 'Folder 1', children: [] },
          { id: 'folder-2', title: 'Folder 2', children: [] },
          { id: 'folder-3', title: 'Folder 3', children: [] },
          { id: 'folder-4', title: 'Folder 4', children: [] },
          { id: 'folder-5', title: 'Folder 5', children: [] },
          { id: 'folder-6', title: 'Folder 6', children: [] },
        ],
      });

    render(
      <AllProviders>
        <BreadcrumbNavigation />
      </AllProviders>
    );

    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('should render Untitled for folder without title', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        navigationStack: ['All', 'folder-1'],
        navigateToPage: mockNavigateToPage,
        navigateBack: mockNavigateBack,
        canGoBack: true,
      });

    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        rawFolders: [
          {
            id: 'folder-1',
            title: '',
            children: [],
          },
        ],
      });

    render(
      <AllProviders>
        <BreadcrumbNavigation />
      </AllProviders>
    );

    expect(screen.getByText('Untitled')).toBeInTheDocument();
  });

  it('should render Uncategorized breadcrumb', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        navigationStack: ['Uncategorized'],
        navigateToPage: mockNavigateToPage,
        navigateBack: mockNavigateBack,
        canGoBack: false,
      });

    when(mockUseBookmarks).calledWith().thenReturn({
      rawFolders: [],
    });

    render(
      <AllProviders>
        <BreadcrumbNavigation />
      </AllProviders>
    );

    expect(screen.getByText('Uncategorized')).toBeInTheDocument();
  });

  it('should not render back button when canGoBack is false', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        navigationStack: ['All'],
        navigateToPage: mockNavigateToPage,
        navigateBack: mockNavigateBack,
        canGoBack: false,
      });

    when(mockUseBookmarks).calledWith().thenReturn({
      rawFolders: [],
    });

    render(
      <AllProviders>
        <BreadcrumbNavigation />
      </AllProviders>
    );

    expect(screen.queryByTestId('breadcrumb-back')).not.toBeInTheDocument();
  });
});
