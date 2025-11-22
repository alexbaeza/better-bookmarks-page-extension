import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SidebarFooter } from '@/features/navigation/sidebar/components/SidebarFooter';
import { AllProviders } from '~test/test-utils';

vi.mock('@/shared/ui/BuiltWith', () => ({
  BuiltWith: ({ className }: { className?: string }) => (
    <div className={className} data-testid="built-with">
      Built With
    </div>
  ),
}));

describe('SidebarFooter', () => {
  it('renders version number', () => {
    render(
      <AllProviders>
        <SidebarFooter />
      </AllProviders>
    );

    expect(screen.getByText(/Version/)).toBeInTheDocument();
  });

  it('renders BuiltWith component', () => {
    render(
      <AllProviders>
        <SidebarFooter />
      </AllProviders>
    );

    expect(screen.getByTestId('built-with')).toBeInTheDocument();
    expect(screen.getByTestId('built-with')).toHaveClass('justify-start');
  });
});
