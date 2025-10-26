import { render, screen } from '@testing-library/react';
import { APP_VERSION } from '@/config/constants';
import { SidebarFooter } from '@/features/navigation/sidebar/components/SidebarFooter';

vi.mock('@/shared/ui/BuiltWith', () => ({
  BuiltWith: ({ className }: { className: string }) => (
    <div className={className} data-testid="built-with">
      Built With Component
    </div>
  ),
}));

describe('SidebarFooter', () => {
  it('renders version information', () => {
    render(<SidebarFooter />);

    expect(screen.getByText(`Version ${APP_VERSION}`)).toBeInTheDocument();
  });

  it('renders BuiltWith component', () => {
    render(<SidebarFooter />);

    expect(screen.getByTestId('built-with')).toBeInTheDocument();
    expect(screen.getByText('Built With Component')).toBeInTheDocument();
  });

  it('applies correct CSS classes to BuiltWith component', () => {
    render(<SidebarFooter />);

    const builtWith = screen.getByTestId('built-with');
    expect(builtWith).toHaveClass('justify-start');
  });

  it('applies correct CSS classes to container', () => {
    render(<SidebarFooter />);

    const container = screen.getByText(`Version ${APP_VERSION}`).parentElement;
    expect(container).toHaveClass('mt-4', 'border-t', 'border-bgColor-tertiary', 'p-2', 'text-xs', 'text-fgColor-secondary');
  });

  it('applies correct CSS classes to version text', () => {
    render(<SidebarFooter />);

    const versionText = screen.getByText(`Version ${APP_VERSION}`);
    expect(versionText).toHaveClass('mb-2');
  });
});
