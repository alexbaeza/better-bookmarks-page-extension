import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '@/shared/ui/Badge';

describe('Badge', () => {
  it('should render without crashing', () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText('Badge')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(<Badge dataTestId="badge">Badge</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('flex', 'items-center', 'justify-center', 'rounded-full', 'font-bold', 'text-center');
  });

  it('should apply size classes correctly', () => {
    render(
      <Badge dataTestId="badge" size="xs">
        Badge
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('text-xs', 'px-1.5', 'py-0.5', 'min-w-[1.25rem]');
  });

  it('should apply sm size classes', () => {
    render(
      <Badge dataTestId="badge" size="sm">
        Badge
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('text-xs', 'px-2', 'py-0.5', 'min-w-[1.5rem]');
  });

  it('should apply base size classes', () => {
    render(
      <Badge dataTestId="badge" size="base">
        Badge
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('text-xs', 'px-2.5', 'py-1', 'min-w-[2rem]');
  });

  it('should apply variant classes', () => {
    render(
      <Badge dataTestId="badge" variant="default">
        Badge
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-bgColor-tertiary', 'text-fgColor-primary');
  });

  it('should apply tertiary variant classes', () => {
    render(
      <Badge dataTestId="badge" variant="tertiary">
        Badge
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-bgColor-tertiary', 'text-fgColor-primary');
  });

  it('should apply custom className', () => {
    render(
      <Badge className="custom-class" dataTestId="badge">
        Badge
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('custom-class');
  });

  it('should apply dataTestId', () => {
    render(<Badge dataTestId="test-badge">Badge</Badge>);
    expect(screen.getByTestId('test-badge')).toBeInTheDocument();
  });

  it('should render children correctly', () => {
    render(
      <Badge>
        <span data-testid="child">Child</span>
      </Badge>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
