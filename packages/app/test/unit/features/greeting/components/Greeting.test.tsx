import { beforeEach, describe, expect, it } from 'vitest';
import { greetingEnabledAtom, greetingNameAtom } from '@/app/providers/atoms';
import { Greeting } from '@/features/greeting/components/Greeting';
import { render, screen } from '~test/test-utils';

describe('Greeting component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('renders greeting component', () => {
    render(<Greeting />, {
      initialValues: [
        [greetingEnabledAtom, true],
        [greetingNameAtom, 'Test User'],
      ],
    });
    expect(screen.getByTestId('greeting')).toBeInTheDocument();
    expect(screen.getByTestId('greeting-message')).toBeInTheDocument();
  });

  it('displays name when greeting is enabled and name is provided', () => {
    render(<Greeting />, {
      initialValues: [
        [greetingEnabledAtom, true],
        [greetingNameAtom, 'Alice'],
      ],
    });
    const message = screen.getByTestId('greeting-message');
    expect(message).toHaveTextContent('Alice');
  });

  it('does not display name when greeting is disabled', () => {
    render(<Greeting />, {
      initialValues: [
        [greetingEnabledAtom, false],
        [greetingNameAtom, 'Bob'],
      ],
    });
    const message = screen.getByTestId('greeting-message');
    expect(message).toBeInTheDocument();
    // Greeting message should exist but not include the name
    expect(message.textContent).not.toContain('Bob');
  });

  it('handles null name gracefully', () => {
    render(<Greeting />, {
      initialValues: [
        [greetingEnabledAtom, true],
        [greetingNameAtom, null],
      ],
    });
    const message = screen.getByTestId('greeting-message');
    expect(message).toBeInTheDocument();
  });

  it('handles empty string name', () => {
    render(<Greeting />, {
      initialValues: [
        [greetingEnabledAtom, true],
        [greetingNameAtom, ''],
      ],
    });
    const message = screen.getByTestId('greeting-message');
    expect(message).toBeInTheDocument();
  });

  it('renders when both are false', () => {
    render(<Greeting />, {
      initialValues: [
        [greetingEnabledAtom, false],
        [greetingNameAtom, null],
      ],
    });
    const message = screen.getByTestId('greeting-message');
    expect(message).toBeInTheDocument();
  });
});
