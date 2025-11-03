import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ItemActionsMenu } from '@/features/bookmarks/components/items/options/ItemActionsMenu';
import { renderWithModalProvider } from '~test/test-utils';

describe('ItemActionsMenu', () => {
  it('should render the options button when visible is true', () => {
    const { getByTestId } = renderWithModalProvider(<ItemActionsMenu visible={true} />);
    expect(getByTestId('item-options-button')).toBeInTheDocument();
  });

  it('should render the options button with opacity-0 when visible is false', () => {
    const { getByTestId } = renderWithModalProvider(<ItemActionsMenu visible={false} />);
    const button = getByTestId('item-options-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('opacity-0');
  });

  it('should prevent event propagation on button click', () => {
    const onClick = vi.fn();
    const { getByTestId } = renderWithModalProvider(
      <div onClick={onClick} onKeyDown={onClick} role="button" tabIndex={0}>
        <ItemActionsMenu visible={true} />
      </div>
    );
    const button = getByTestId('item-options-button');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const { getByTestId } = renderWithModalProvider(<ItemActionsMenu className="custom-class" visible={true} />);
    const button = getByTestId('item-options-button');
    expect(button).toHaveClass('custom-class');
  });

  it('should use custom iconSize', () => {
    const { getByTestId } = renderWithModalProvider(<ItemActionsMenu iconSize={20} visible={true} />);
    const icon = getByTestId('item-options-button').querySelector('svg');
    expect(icon).toHaveAttribute('width', '20');
  });
});
