import { act, render, screen } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children', () => {
    render(
      <ModalProvider>
        <div data-testid="child">Child</div>
      </ModalProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
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

  it('provides modal functions to children', () => {
    let modalContext: { showModal: typeof useModal; hideModal: typeof useModal };

    const TestChild = () => {
      modalContext = useModal();
      return <div data-testid="child">Child</div>;
    };

    render(
      <ModalProvider>
        <TestChild />
      </ModalProvider>
    );

    expect(modalContext?.showModal).toBeDefined();
    expect(modalContext?.hideModal).toBeDefined();
    expect(typeof modalContext?.showModal).toBe('function');
    expect(typeof modalContext?.hideModal).toBe('function');
  });

  it('supports multiple modal operations', () => {
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

    act(() => {
      showButton.click();
    });

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});

describe('useModal', () => {
  it('throws error when used outside provider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    let errorThrown = false;
    try {
      const BadComponent = () => {
        useModal();
        return <div>Bad</div>;
      };
      render(<BadComponent />);
    } catch (e) {
      errorThrown = true;
      expect((e as Error).message).toContain('useModal must be inside ModalProvider');
    }

    expect(errorThrown).toBe(true);

    consoleErrorSpy.mockRestore();
  });
});
