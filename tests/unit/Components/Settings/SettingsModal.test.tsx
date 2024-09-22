import { fireEvent, render, screen } from '@testing-library/react';
import { SettingsModal } from '../../../../src/Components/Settings/SettingsModal';

describe('SettingsModal', () => {
  test('renders gear icon button', () => {
    render(<SettingsModal />);
    const buttonElement = screen.getByTestId('options-modal-button');
    expect(buttonElement).toBeInTheDocument();
  });

  test('renders modal when gear icon button is clicked', () => {
    render(<SettingsModal />);
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const modalContentElement = screen.getByTestId('options-modal-content');
    expect(modalContentElement).toBeInTheDocument();
  });

  test('renders close button in modal', () => {
    render(<SettingsModal />);
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const closeButtonElement = screen.getByTestId(
      'options-modal-content-close-button'
    );
    expect(closeButtonElement).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', () => {
    render(<SettingsModal />);
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const closeButtonElement = screen.getByTestId(
      'options-modal-content-close-button'
    );
    fireEvent.click(closeButtonElement);
    const modalContentElement = screen.queryByTestId('options-modal-content');
    expect(modalContentElement).not.toBeInTheDocument();
  });

  test('renders sidebar settings in modal', () => {
    render(<SettingsModal />);
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const greetingSettingsElement = screen.getByTestId('sidebar-settings');
    expect(greetingSettingsElement).toBeInTheDocument();
  });

  test('renders greeting settings in modal', () => {
    render(<SettingsModal />);
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const greetingSettingsElement = screen.getByTestId('greeting-settings');
    expect(greetingSettingsElement).toBeInTheDocument();
  });

  test('renders background overlay settings in modal', () => {
    render(<SettingsModal />);
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const backgroundOverlaySettingsElement = screen.getByTestId(
      'background-overlay-settings'
    );
    expect(backgroundOverlaySettingsElement).toBeInTheDocument();
  });

  test('renders theme settings in modal', () => {
    render(<SettingsModal />);
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const themeSettingsElement = screen.getByTestId('theme-settings');
    expect(themeSettingsElement).toBeInTheDocument();
  });

  test('renders sponsor in modal', () => {
    render(<SettingsModal />);
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const sponsorElement = screen.getByTestId('sponsor');
    expect(sponsorElement).toBeInTheDocument();
  });
});
