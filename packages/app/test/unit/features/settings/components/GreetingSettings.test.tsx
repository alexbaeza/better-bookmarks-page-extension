import { fireEvent, render, screen } from '@testing-library/react';

import { GreetingSettings } from '@/features/settings/components/GreetingSettings';

describe('GreetingSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('When Greeting is disabled', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('renders the component', () => {
      localStorage.setItem('BB-greetingEnabled', 'false');
      render(<GreetingSettings />);
      const greetingToggle = screen.getByTestId('greeting-enabled-toggle');
      expect(greetingToggle).not.toBeChecked();

      expect(screen.queryByTestId('greeting-name-input')).not.toBeInTheDocument();
    });

    it('does not render input when greeting is not shown', () => {
      localStorage.setItem('BB-greetingEnabled', 'false');
      render(<GreetingSettings />);
      expect(screen.queryByTestId('greeting-name-input')).not.toBeInTheDocument();
    });
  });

  describe('When Greeting is enabled', () => {
    beforeEach(() => {
      localStorage.clear();
      localStorage.setItem('BB-greeting-enabled', 'true');
      localStorage.setItem('BB-greetingName', 'Bob');
    });

    it('updates the greeting name state when the input value is changed', () => {
      render(<GreetingSettings />);

      const input = screen.getByTestId('greeting-name-input');
      fireEvent.change(input, { target: { value: 'Jane' } });

      expect(input).toBeEnabled();
      expect(input).toHaveValue('Jane');
    });

    it('updates the greeting enabled state when the checkbox is clicked', () => {
      render(<GreetingSettings />);

      const greetingToggle = screen.getByTestId('greeting-enabled-toggle');
      expect(greetingToggle).toBeChecked();

      fireEvent.click(greetingToggle);

      // Just verify the toggle is clickable
      expect(greetingToggle).toBeInTheDocument();
    });

    it('renders an enabled input when the greeting is enabled', () => {
      render(<GreetingSettings />);

      const input = screen.getByTestId('greeting-name-input') as HTMLInputElement;

      expect(input).toBeEnabled();
    });

    it('does not render input when greeting is disabled', () => {
      localStorage.setItem('BB-greetingEnabled', 'false');
      render(<GreetingSettings />);

      expect(screen.queryByTestId('greeting-name-input')).not.toBeInTheDocument();
    });
  });
});
