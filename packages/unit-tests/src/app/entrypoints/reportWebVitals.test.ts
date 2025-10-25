import { vi } from 'vitest';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

import reportWebVitals from '@/app/entrypoints/reportWebVitals';

describe('reportWebVitals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does nothing if onPerfEntry is not provided', () => {
    reportWebVitals();
    expect(onCLS).not.toHaveBeenCalled();
    expect(onINP).not.toHaveBeenCalled();
    expect(onFCP).not.toHaveBeenCalled();
    expect(onLCP).not.toHaveBeenCalled();
    expect(onTTFB).not.toHaveBeenCalled();
  });

  it('does nothing if onPerfEntry is not a function', () => {
    reportWebVitals('not a function' as unknown);
    expect(onCLS).not.toHaveBeenCalled();
    expect(onINP).not.toHaveBeenCalled();
    expect(onFCP).not.toHaveBeenCalled();
    expect(onLCP).not.toHaveBeenCalled();
    expect(onTTFB).not.toHaveBeenCalled();
  });

  it('calls web-vitals functions when onPerfEntry is provided', async () => {
    const mockOnPerfEntry = vi.fn();

    reportWebVitals(mockOnPerfEntry);

    // Wait for the dynamic import to resolve
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(onCLS).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(onINP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(onFCP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(onLCP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(onTTFB).toHaveBeenCalledWith(mockOnPerfEntry);
  });
});
