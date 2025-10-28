import { SettingsFlyoutContainer } from '@/features/settings/containers/SettingsFlyoutContainer';
import { fireEvent, render, screen } from '~test/test-utils';

describe('SettingsFlyoutContainer', () => {
  it('renders toggle button', () => {
    render(
      <SettingsFlyoutContainer>
        <div>Test content</div>
      </SettingsFlyoutContainer>
    );

    expect(screen.getByTestId('settings-toggle')).toBeInTheDocument();
  });

  it('opens flyout when toggle is clicked', () => {
    render(
      <SettingsFlyoutContainer>
        <div>Test content</div>
      </SettingsFlyoutContainer>
    );

    const toggleButton = screen.getByTestId('settings-toggle');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('closes flyout when close button is clicked', () => {
    render(
      <SettingsFlyoutContainer>
        <div>Test content</div>
      </SettingsFlyoutContainer>
    );

    const toggleButton = screen.getByTestId('settings-toggle');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Settings')).toBeInTheDocument();

    const closeButton = screen.getByTestId('modal-close-button');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('closes flyout when backdrop is clicked', () => {
    render(
      <SettingsFlyoutContainer>
        <div>Test content</div>
      </SettingsFlyoutContainer>
    );

    const toggleButton = screen.getByTestId('settings-toggle');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Settings')).toBeInTheDocument();

    const backdrop = document.querySelector('.fixed.inset-0.z-\\[100\\]');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });
});
