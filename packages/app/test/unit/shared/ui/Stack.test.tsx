import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from '@/shared/ui/Stack';

describe('Stack', () => {
  it('should apply default classes', () => {
    render(<Stack data-testid="stack">Content</Stack>);
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveClass('flex', 'flex-col', 'space-y-3');
  });

  it('should not apply space-y class when gap="none"', () => {
    render(
      <Stack data-testid="stack" gap="none">
        Content
      </Stack>
    );
    const stack = screen.getByTestId('stack');
    expect(stack.className).not.toContain('space-y-');
  });

  it.each([
    ['xs', 'space-y-1'],
    ['sm', 'space-y-2'],
    ['md', 'space-y-3'],
    ['lg', 'space-y-4'],
    ['xl', 'space-y-6'],
  ])('should apply space-y class "%s" when gap="%s"', (gap, expectedClass) => {
    render(
      // @ts-expect-error - Testing invalid prop value
      <Stack data-testid="stack" gap={gap}>
        Content
      </Stack>
    );
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveClass(expectedClass);
  });

  it('should apply custom className', () => {
    render(
      <Stack className="custom-class" data-testid="stack">
        Content
      </Stack>
    );
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveClass('custom-class');
  });

  it('should apply data-testid', () => {
    render(<Stack data-testid="test-stack">Content</Stack>);
    expect(screen.getByTestId('test-stack')).toBeInTheDocument();
  });
});
