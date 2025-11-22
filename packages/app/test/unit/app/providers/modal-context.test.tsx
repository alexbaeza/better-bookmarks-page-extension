import { act, render, screen } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ModalProvider, useModal } from '@/app/providers/modal-context';

const TestChild: React.FC = () => {
  const { showModal, hideModal } = useModal();
  return (
    <div>
      <button
        data-testid="show-modal"
        onClick={() => showModal(<div data-testid="modal">Modal Content</div>)}
        type="button"
      >
        Show
      </button>
      <button data-testid="hide-modal" onClick={hideModal} type="button">
        Hide
      </button>
    </div>
  );
};

describe('ModalProvider', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders modal content when showModal is called', () => {
    render(
      <ModalProvider>
        <TestChild />
      </ModalProvider>
    );

    const showButton = screen.getByTestId('show-modal');
    act(() => {
      showButton.click();
    });

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('hides modal content when hideModal is called', () => {
    render(
      <ModalProvider>
        <TestChild />
      </ModalProvider>
    );

    const showButton = screen.getByTestId('show-modal');
    act(() => {
      showButton.click();
    });

    expect(screen.getByTestId('modal')).toBeInTheDocument();

    const hideButton = screen.getByTestId('hide-modal');
    act(() => {
      hideButton.click();
    });

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});
