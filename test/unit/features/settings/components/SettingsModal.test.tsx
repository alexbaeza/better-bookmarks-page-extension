import { SettingsModal } from '@/features/settings/components/SettingsModal';
import { AllProviders, fireEvent, render, screen } from '~test/test-utils';

describe('SettingsModal', () => {
  beforeEach(() => {
    const portalRoot = document.createElement('div');
    portalRoot.id = 'modal-root';
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
  test('renders gear icon button', () => {
    render(<SettingsModal />, { wrapper: AllProviders });
    const buttonElement = screen.getByTestId('options-modal-button');
    expect(buttonElement).toBeInTheDocument();
  });

  test('renders modal when gear icon button is clicked', () => {
    render(<SettingsModal />, { wrapper: AllProviders });
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const modalElement = screen.getByRole('dialog');
    expect(modalElement).toBeInTheDocument();
  });

  test('renders close button in modal', () => {
    render(<SettingsModal />, { wrapper: AllProviders });
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const closeButtonElement = screen.getByTestId('modal-close-button');
    expect(closeButtonElement).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', () => {
    render(<SettingsModal />, { wrapper: AllProviders });
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const closeButtonElement = screen.getByTestId('modal-close-button');
    fireEvent.click(closeButtonElement);
    const modalElement = screen.queryByRole('dialog');
    expect(modalElement).not.toBeInTheDocument();
  });

  test('renders sidebar settings in modal', () => {
    render(<SettingsModal />, { wrapper: AllProviders });
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const greetingSettingsElement = screen.getByTestId('sidebar-settings');
    expect(greetingSettingsElement).toBeInTheDocument();
  });

  test('renders greeting settings in modal', () => {
    render(<SettingsModal />, { wrapper: AllProviders });
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const greetingSettingsElement = screen.getByTestId('greeting-settings');
    expect(greetingSettingsElement).toBeInTheDocument();
  });

  test('renders background overlay settings in modal', () => {
    render(<SettingsModal />, { wrapper: AllProviders });
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const backgroundOverlaySettingsElement = screen.getByTestId('background-overlay-settings');
    expect(backgroundOverlaySettingsElement).toBeInTheDocument();
  });

  test('renders theme settings in modal', () => {
    render(<SettingsModal />, { wrapper: AllProviders });
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const themeSettingsElement = screen.getByTestId('theme-settings');
    expect(themeSettingsElement).toBeInTheDocument();
  });

  test('renders sponsor in modal', () => {
    render(<SettingsModal />, { wrapper: AllProviders });
    const buttonElement = screen.getByTestId('options-modal-button');
    fireEvent.click(buttonElement);
    const sponsorElement = screen.getByTestId('sponsor');
    expect(sponsorElement).toBeInTheDocument();
  });
});
