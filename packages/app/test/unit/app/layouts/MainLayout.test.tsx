import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';
import { MainLayout } from '@/app/layouts/MainLayout';

const mockUseAtomValue = vi.fn();
vi.mock('jotai', () => ({
  useAtomValue: () => mockUseAtomValue(),
}));

vi.mock('@/app/providers/atoms', () => ({
  sidebarEnabledAtom: {},
}));

vi.mock('@/features/navigation/sidebar/components/SidebarFooter', () => ({
  SidebarFooter: () => <div data-testid="sidebar-footer">Footer</div>,
}));

vi.mock('@/features/navigation/sidebar/containers/Sidebar', () => ({
  Sidebar: ({ title, footer }: { title: string; footer: React.ReactNode }) => (
    <div data-testid="sidebar">
      <div data-testid="sidebar-title">{title}</div>
      {footer}
    </div>
  ),
}));

vi.mock('@/app/layouts/MainContent', () => ({
  MainContent: ({ children }: { children?: React.ReactNode }) => <div data-testid="main-content">{children}</div>,
}));

describe('MainLayout', () => {
  it('should render without crashing', () => {
    when(mockUseAtomValue).calledWith().thenReturn(false);
    render(<MainLayout />);
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  it('should render MainContent component', () => {
    when(mockUseAtomValue).calledWith().thenReturn(false);
    render(<MainLayout />);
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  it('should render Sidebar when sidebar is enabled', () => {
    when(mockUseAtomValue).calledWith().thenReturn(true);
    render(<MainLayout />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('should not render Sidebar when sidebar is disabled', () => {
    when(mockUseAtomValue).calledWith().thenReturn(false);
    render(<MainLayout />);
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('should render Sidebar with correct title', () => {
    when(mockUseAtomValue).calledWith().thenReturn(true);
    render(<MainLayout />);
    expect(screen.getByTestId('sidebar-title')).toHaveTextContent('Better Bookmarks');
  });

  it('should render SidebarFooter in Sidebar', () => {
    when(mockUseAtomValue).calledWith().thenReturn(true);
    render(<MainLayout />);
    expect(screen.getByTestId('sidebar-footer')).toBeInTheDocument();
  });

  it('should render children in MainContent', () => {
    when(mockUseAtomValue).calledWith().thenReturn(false);
    render(
      <MainLayout>
        <div data-testid="test-child">Test Child</div>
      </MainLayout>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should have flex layout classes', () => {
    when(mockUseAtomValue).calledWith().thenReturn(false);
    const { container } = render(<MainLayout />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex', 'flex-1', 'overflow-hidden');
  });

  it('should render both Sidebar and MainContent when sidebar is enabled', () => {
    when(mockUseAtomValue).calledWith().thenReturn(true);
    render(<MainLayout />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });
});
