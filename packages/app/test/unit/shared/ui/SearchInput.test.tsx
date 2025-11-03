import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { SearchInput } from '@/shared/ui/SearchInput';
import { AllProviders } from '~test/test-utils';

describe('SearchInput', () => {
  const mockOnChange = vi.fn();

  it('renders with placeholder', () => {
    render(
      <AllProviders>
        <SearchInput onChange={mockOnChange} placeholder="Search bookmarks" value="" />
      </AllProviders>
    );

    expect(screen.getByPlaceholderText('Search bookmarks')).toBeInTheDocument();
  });

  it('renders with custom dataTestId', () => {
    render(
      <AllProviders>
        <SearchInput data-testid="custom-search" onChange={mockOnChange} placeholder="Search" value="" />
      </AllProviders>
    );

    expect(screen.getByTestId('custom-search')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    render(
      <AllProviders>
        <SearchInput onChange={mockOnChange} placeholder="Search" value="" />
      </AllProviders>
    );

    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  it('shows clear button when value is not empty', () => {
    render(
      <AllProviders>
        <SearchInput onChange={mockOnChange} placeholder="Search" value="test" />
      </AllProviders>
    );

    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('does not show clear button when value is empty', () => {
    render(
      <AllProviders>
        <SearchInput onChange={mockOnChange} placeholder="Search" value="" />
      </AllProviders>
    );

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button is clicked', () => {
    render(
      <AllProviders>
        <SearchInput onChange={mockOnChange} placeholder="Search" value="test" />
      </AllProviders>
    );

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('applies custom className', () => {
    render(
      <AllProviders>
        <SearchInput className="custom-class" onChange={mockOnChange} placeholder="Search" value="" />
      </AllProviders>
    );

    const container = screen.getByPlaceholderText('Search').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('applies correct CSS classes to input', () => {
    render(
      <AllProviders>
        <SearchInput onChange={mockOnChange} placeholder="Search" value="" />
      </AllProviders>
    );

    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveClass(
      'w-full',
      'rounded-xl',
      'bg-bgColor-secondary',
      'px-12',
      'py-5',
      'text-xl',
      'text-fgColor-primary'
    );
  });

  it('applies correct CSS classes to container', () => {
    render(
      <AllProviders>
        <SearchInput onChange={mockOnChange} placeholder="Search" value="" />
      </AllProviders>
    );

    const container = screen.getByPlaceholderText('Search').closest('div');
    expect(container).toHaveClass('relative', 'mx-auto', 'w-full', 'max-w-xl');
  });
});
