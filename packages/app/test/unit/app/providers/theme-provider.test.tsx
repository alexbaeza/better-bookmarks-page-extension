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
});
