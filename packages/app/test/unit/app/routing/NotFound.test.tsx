import { vi } from 'vitest';

import { NotFoundPage } from '@/app/routing/NotFound';
import { render, screen } from '~test/test-utils';

vi.mock('@/features/navigation/components/NotFoundIllustration', () => ({
  NotFoundIllustration: ({ className }: { className?: string }) => (
    <div className={className} data-testid="not-found-illustration">
      Illustration
    </div>
  ),
}));

describe('NotFoundPage', () => {
  it('renders the 404 message', () => {
    render(<NotFoundPage />);

    expect(screen.getByText('404 – Page not found')).toBeInTheDocument();
  });

  it('renders the NotFoundIllustration', () => {
    render(<NotFoundPage />);

    expect(screen.getByTestId('not-found-illustration')).toBeInTheDocument();
  });

  it('has correct styling', () => {
    render(<NotFoundPage />);

    const container = screen.getByText('404 – Page not found').parentElement?.parentElement;
    expect(container).toHaveClass('flex size-full items-center justify-center p-4');

    const text = screen.getByText('404 – Page not found');
    expect(text).toHaveClass('text-center text-lg font-semibold text-fgColor-primary');
  });
});
