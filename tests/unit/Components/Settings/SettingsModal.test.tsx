import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsModal } from '../../../../src/Components/Settings/SettingsModal';

describe('SettingsModal', () => {
  it('renders the gear icon button', () => {
    render(<SettingsModal />);
    const gearIcon = screen.getByTestId('options-modal-button');
    expect(gearIcon).toBeInTheDocument();
  });

  it('opens the modal when gear icon button is clicked', () => {
    render(<SettingsModal />);
    const gearIcon = screen.getByTestId('options-modal-button');
    fireEvent.click(gearIcon);
    const modal = screen.getByTestId('options-modal-content');
    expect(modal).toBeInTheDocument();
  });

  it('closes the modal when close icon button is clicked', () => {
    render(<SettingsModal />);
    const gearIcon = screen.getByTestId('options-modal-button');
    fireEvent.click(gearIcon);
    const closeButton = screen.getByTestId(
      'options-modal-content-close-button'
    );
    fireEvent.click(closeButton);
    const modal = screen.queryByTestId('options-modal-content');
    expect(modal).not.toBeInTheDocument();
  });

  it('renders greeting settings component', () => {
    render(<SettingsModal />);
    const gearIcon = screen.getByTestId('options-modal-button');
    fireEvent.click(gearIcon);
    const greetingSettings = screen.getByText(/What should we call you?/i);
    expect(greetingSettings).toBeInTheDocument();
  });

  it('renders background settings component', () => {
    render(<SettingsModal />);
    const gearIcon = screen.getByTestId('options-modal-button');
    fireEvent.click(gearIcon);
    const backgroundSettings = screen.getByText(/Select an overlay/i);
    expect(backgroundSettings).toBeInTheDocument();
  });

  it('renders sponsor component', () => {
    render(<SettingsModal />);
    const gearIcon = screen.getByTestId('options-modal-button');
    fireEvent.click(gearIcon);
    const sponsor = screen.getByText(/This app was built/i);
    expect(sponsor).toBeInTheDocument();
  });
});
