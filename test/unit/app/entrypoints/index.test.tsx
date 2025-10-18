import { vi } from 'vitest';
import { when } from 'vitest-when';

vi.mock('@/app/app', () => ({
  App: () => <div data-testid="app">App</div>,
}));
vi.mock('@/app/entrypoints/reportWebVitals', () => ({
  default: vi.fn(),
}));

import { createRoot } from 'react-dom/client';

import reportWebVitals from '@/app/entrypoints/reportWebVitals';

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(),
}));

const mockCreateRoot = vi.mocked(createRoot);
const mockReportWebVitals = vi.mocked(reportWebVitals);

describe('index.tsx', () => {
  let mockRoot: { render: ReturnType<typeof vi.fn> };
  let mockContainer: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContainer = document.createElement('div');
    mockContainer.id = 'root';
    mockRoot = { render: vi.fn() };
    when(mockCreateRoot)
      .calledWith(mockContainer)
      .thenReturn(mockRoot as ReturnType<typeof createRoot>);

    vi.spyOn(document, 'getElementById').mockReturnValue(mockContainer);
  });

  it('initializes the app correctly', async () => {
    await import('@/app/entrypoints/index');

    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(mockCreateRoot).toHaveBeenCalledWith(mockContainer);
    expect(mockRoot.render).toHaveBeenCalled();
    expect(mockReportWebVitals).toHaveBeenCalled();
  });
});
