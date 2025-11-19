import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { ThemeProvider } from '@/app/providers/theme-provider';
import { useApplyTheme } from '@/shared/hooks/useApplyTheme';
import { AllProviders } from '~test/test-utils';

vi.mock('@/shared/hooks/useApplyTheme', () => ({
  useApplyTheme: vi.fn(),
}));

describe('ThemeProvider', () => {
  let mockUseApplyTheme: ReturnType<typeof vi.mocked<typeof useApplyTheme>>;

  beforeEach(() => {
    mockUseApplyTheme = vi.mocked(useApplyTheme);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children without additional wrapper', () => {
    const { container } = render(
      <AllProviders>
        <ThemeProvider>
          <div data-testid="child">Test Child</div>
        </ThemeProvider>
      </AllProviders>
    );

    expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument();
  });

  it('calls useApplyTheme hook', () => {
    render(
      <AllProviders>
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      </AllProviders>
    );

    expect(mockUseApplyTheme).toHaveBeenCalledTimes(1);
  });

  it('renders multiple children correctly', () => {
    const { container } = render(
      <AllProviders>
        <ThemeProvider>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
          <span data-testid="child3">Child 3</span>
        </ThemeProvider>
      </AllProviders>
    );

    expect(container.querySelector('[data-testid="child1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child2"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child3"]')).toBeInTheDocument();
  });

  it('renders fragment children correctly', () => {
    const { container } = render(
      <AllProviders>
        <ThemeProvider>
          <div data-testid="fragment-child1">Fragment Child 1</div>
          <div data-testid="fragment-child2">Fragment Child 2</div>
        </ThemeProvider>
      </AllProviders>
    );

    expect(container.querySelector('[data-testid="fragment-child1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="fragment-child2"]')).toBeInTheDocument();
  });

  it('handles null children gracefully', () => {
    const { container } = render(
      <AllProviders>
        <ThemeProvider>{null}</ThemeProvider>
      </AllProviders>
    );

    expect(container.firstChild).toBeNull();
  });

  it('handles undefined children gracefully', () => {
    const { container } = render(
      <AllProviders>
        <ThemeProvider>{undefined}</ThemeProvider>
      </AllProviders>
    );

    expect(container.firstChild).toBeNull();
  });
});
