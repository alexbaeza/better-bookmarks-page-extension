import { render, screen } from '@testing-library/react';

import { Text } from '@/shared/ui/Text';

describe('Text', () => {
  it('renders with default props', () => {
    render(<Text>Test content</Text>);
    const element = screen.getByText('Test content');
    expect(element.tagName).toBe('P');
    expect(element).toHaveClass(
      'text-base',
      'text-fgColor-primary',
      'font-normal',
      'break-words',
      'hyphens-auto',
      'whitespace-normal'
    );
  });

  it('renders different semantic tags', () => {
    const { rerender } = render(<Text as="h1">Heading 1</Text>);
    expect(screen.getByText('Heading 1').tagName).toBe('H1');

    rerender(<Text as="h2">Heading 2</Text>);
    expect(screen.getByText('Heading 2').tagName).toBe('H2');

    rerender(<Text as="span">Span text</Text>);
    expect(screen.getByText('Span text').tagName).toBe('SPAN');
  });

  it('applies size classes', () => {
    render(<Text size="xs">Small text</Text>);
    expect(screen.getByText('Small text')).toHaveClass('text-xs');

    render(<Text size="lg">Large text</Text>);
    expect(screen.getByText('Large text')).toHaveClass('text-lg');

    render(<Text size="2xl">Extra large text</Text>);
    expect(screen.getByText('Extra large text')).toHaveClass('text-2xl');
  });

  it('applies color classes', () => {
    render(<Text color="secondary">Secondary text</Text>);
    expect(screen.getByText('Secondary text')).toHaveClass('text-fgColor-secondary');

    render(<Text color="accent">Accent text</Text>);
    expect(screen.getByText('Accent text')).toHaveClass('text-fgColor-accent');
  });

  it('applies weight classes', () => {
    render(<Text weight="bold">Bold text</Text>);
    expect(screen.getByText('Bold text')).toHaveClass('font-bold');

    render(<Text weight="semibold">Semibold text</Text>);
    expect(screen.getByText('Semibold text')).toHaveClass('font-semibold');
  });

  it('applies align classes', () => {
    render(<Text align="center">Centered text</Text>);
    expect(screen.getByText('Centered text')).toHaveClass('text-center');

    render(<Text align="right">Right aligned text</Text>);
    expect(screen.getByText('Right aligned text')).toHaveClass('text-right');
  });

  it('applies line clamp classes', () => {
    render(<Text lineClamp={2}>Clamped text</Text>);
    expect(screen.getByText('Clamped text')).toHaveClass('line-clamp-2');

    render(<Text lineClamp={3}>3 line clamped</Text>);
    expect(screen.getByText('3 line clamped')).toHaveClass('line-clamp-3');
  });

  it('applies truncate class when truncate is true', () => {
    render(<Text truncate>Truncated text</Text>);
    expect(screen.getByText('Truncated text')).toHaveClass('truncate');
  });

  it('applies custom className', () => {
    render(<Text className="custom-class">Custom styled text</Text>);
    expect(screen.getByText('Custom styled text')).toHaveClass('custom-class');
  });

  it('combines multiple props correctly', () => {
    render(
      <Text align="center" as="h2" className="mt-4" color="primary" size="xl" weight="bold">
        Complex text
      </Text>
    );
    const element = screen.getByText('Complex text');
    expect(element.tagName).toBe('H2');
    expect(element).toHaveClass('text-xl', 'text-fgColor-primary', 'font-bold', 'text-center', 'mt-4');
  });
});
