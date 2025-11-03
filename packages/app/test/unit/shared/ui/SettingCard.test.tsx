import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SettingCard } from '@/shared/ui/SettingCard';

describe('SettingCard', () => {
  it('should render without crashing', () => {
    render(<SettingCard description="Test description" title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should render title and description', () => {
    render(<SettingCard description="Description text" title="Title text" />);
    expect(screen.getByText('Title text')).toBeInTheDocument();
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('should render toggle when provided', () => {
    render(
      <SettingCard
        description="Description"
        title="Title"
        toggle={
          <button data-testid="toggle" type="button">
            Toggle
          </button>
        }
      />
    );
    expect(screen.getByTestId('toggle')).toBeInTheDocument();
  });

  it('should not render toggle when not provided', () => {
    render(<SettingCard description="Description" title="Title" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<SettingCard className="custom-class" description="Description" title="Title" />);
    const card = container.querySelector('.custom-class');
    expect(card).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(<SettingCard description="Description" title="Title" />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('flex', 'items-center', 'justify-between', 'bg-bgColor-primary', 'rounded-lg', 'p-4');
  });
});
