import { fireEvent, render, screen } from '@testing-library/react';
import * as jotai from 'jotai';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { greetingEnabledAtom, greetingNameAtom } from '@/app/providers/atoms';
import { GreetingSettings } from '@/features/settings/components/GreetingSettings';

describe('GreetingSettings', () => {
  let spy: vi.SpyInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    spy = vi.spyOn(jotai, 'useAtom');
  });

  describe('When Greeting is disabled', () => {
    beforeEach(() => {
      when(spy)
        .calledWith(greetingEnabledAtom)
        .thenReturn([false, vi.fn() as never]);
      when(spy)
        .calledWith(greetingNameAtom)
        .thenReturn(['Test Name', vi.fn() as never]);
    });

    it('renders the component', () => {
      render(<GreetingSettings />);
      const greetingToggle = screen.getByTestId('greeting-enabled-toggle');
      expect(greetingToggle).not.toBeChecked();

      // Input should not be visible when greeting is not shown
      expect(screen.queryByTestId('greeting-name-input')).not.toBeInTheDocument();
    });

    it('does not render input when greeting is not shown', () => {
      render(<GreetingSettings />);
      expect(screen.queryByTestId('greeting-name-input')).not.toBeInTheDocument();
    });
  });

  describe('When Greeting is enabled', () => {
    beforeEach(() => {
      when(spy)
        .calledWith(greetingEnabledAtom)
        .thenReturn([true, vi.fn() as never]);
      when(spy)
        .calledWith(greetingNameAtom)
        .thenReturn(['Bob', vi.fn() as never]);
    });

    it('updates the greeting name state when the input value is changed', () => {
      const setGreetingNameMock = vi.fn();
      when(spy)
        .calledWith(greetingEnabledAtom)
        .thenReturn([true, vi.fn() as never]);
      when(spy)
        .calledWith(greetingNameAtom)
        .thenReturn(['Bob', setGreetingNameMock as never]);

      render(<GreetingSettings />);
      const input = screen.getByTestId('greeting-name-input');
      fireEvent.change(input, { target: { value: 'Jane' } });

      expect(setGreetingNameMock).toHaveBeenCalledTimes(1);
      expect(setGreetingNameMock).toHaveBeenCalledWith('Jane');
      expect(input).toBeEnabled();
    });

    it('updates the greeting enabled state when the checkbox is clicked', () => {
      const setGreetingEnabledMock = vi.fn();
      when(spy)
        .calledWith(greetingEnabledAtom)
        .thenReturn([true, setGreetingEnabledMock as never]);
      when(spy)
        .calledWith(greetingNameAtom)
        .thenReturn(['Bob', vi.fn() as never]);

      render(<GreetingSettings />);

      const greetingToggle = screen.getByTestId('greeting-enabled-toggle');
      expect(greetingToggle).toBeChecked();

      fireEvent.click(greetingToggle);

      expect(setGreetingEnabledMock).toHaveBeenCalledTimes(1);
      expect(setGreetingEnabledMock).toHaveBeenCalledWith(false);
    });

    it('renders an enabled input when the greeting is enabled', () => {
      render(<GreetingSettings />);
      const input = screen.getByTestId('greeting-name-input') as HTMLInputElement;

      expect(input).toBeEnabled();
    });

    it('does not render input when greeting is disabled', () => {
      when(spy)
        .calledWith(greetingEnabledAtom)
        .thenReturn([false, vi.fn() as never]);

      render(<GreetingSettings />);
      expect(screen.queryByTestId('greeting-name-input')).not.toBeInTheDocument();
    });
  });
});
