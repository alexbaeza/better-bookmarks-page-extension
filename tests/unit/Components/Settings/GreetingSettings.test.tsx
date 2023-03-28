import { fireEvent, render, screen } from '@testing-library/react';
import * as jotai from 'jotai';
import { GreetingSettings } from '../../../../src/Components/Settings/GreetingSettings';
import {
  greetingEnabledAtom,
  greetingNameAtom
} from '../../../../src/Context/atoms';
import { when } from 'jest-when';

describe('GreetingSettings', () => {
  let spy: jest.SpyInstance;

  describe('When Greeting toggle is disabled', () => {
    beforeEach(() => {
      jest.clearAllMocks();

      spy = jest.spyOn(jotai, 'useAtom');

      when(spy)
        .calledWith(greetingEnabledAtom)
        .mockReturnValue([false, jest.fn() as never]);
    });

    it('renders the component', () => {
      render(<GreetingSettings />);
      const greetingToggle = screen.getByTestId('greeting-settings-toggle');
      expect(greetingToggle).not.toBeChecked();
      const greetingSettingsTitle = screen.getByTestId(
        'greeting-settings-title'
      ) as HTMLInputElement;
      expect(greetingSettingsTitle.classList).toContain('text-text-primary');

      expect(greetingSettingsTitle).toHaveTextContent(
        '🤝 What should we call you?'
      );
      const greetingSettingsInputDisabled = screen.getByTestId(
        'greeting-settings-input'
      );
      expect(greetingSettingsInputDisabled).toBeInTheDocument();
      expect(greetingSettingsInputDisabled).toBeDisabled();
    });

    it('renders a disabled input when the greeting is not enabled', () => {
      when(spy)
        .calledWith(greetingNameAtom)
        .mockReturnValue(['Bob', jest.fn() as never]);
      render(<GreetingSettings />);
      const input = screen.getByTestId(
        'greeting-settings-input'
      ) as HTMLInputElement;

      expect(input).toBeDisabled();
      expect(input.value).toBe('Bob');
      expect(input.classList).toContain('cursor-not-allowed');
    });
  });

  describe('When Greeting toggle is enabled', () => {
    beforeEach(() => {
      jest.clearAllMocks();

      spy = jest.spyOn(jotai, 'useAtom');

      when(spy)
        .calledWith(greetingEnabledAtom)
        .mockReturnValue([true, jest.fn() as never]);
    });

    it('updates the greeting name state when the input value is changed', () => {
      const setGreetingNameMock = jest.fn();

      when(spy)
        .calledWith(greetingNameAtom)
        .mockReturnValue(['Bob', setGreetingNameMock]);

      render(<GreetingSettings />);
      const input = screen.getByTestId('greeting-settings-input');
      fireEvent.change(input, { target: { value: 'Jane' } });

      expect(setGreetingNameMock).toHaveBeenCalledTimes(1);
      expect(setGreetingNameMock).toHaveBeenCalledWith('Jane');
      expect(input).toBeEnabled();
    });

    it('updates the greeting enabled state when the checkbox is clicked', () => {
      const setGreetingEnabledMock = jest.fn();
      when(spy)
        .calledWith(greetingEnabledAtom)
        .mockReturnValueOnce([true, setGreetingEnabledMock]);

      render(<GreetingSettings />);

      const greetingToggle = screen.getByTestId('greeting-settings-toggle');
      expect(greetingToggle).toBeChecked();

      fireEvent.click(greetingToggle);

      expect(greetingToggle).not.toBeChecked();

      expect(setGreetingEnabledMock).toHaveBeenCalledTimes(1);
      expect(setGreetingEnabledMock).toHaveBeenCalledWith(false);
    });

    it('renders an enabled input when the greeting is enabled', () => {
      render(<GreetingSettings />);
      const input = screen.getByTestId(
        'greeting-settings-input'
      ) as HTMLInputElement;

      expect(input).toBeEnabled();
      expect(input.classList).not.toContain('cursor-not-allowed');
    });
  });
});
