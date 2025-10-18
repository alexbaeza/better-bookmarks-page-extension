import { vi } from 'vitest';

import reportWebVitals from '@/app/entrypoints/reportWebVitals';

const mockOnCLS = vi.fn();
const mockOnINP = vi.fn();
const mockOnFCP = vi.fn();
const mockOnLCP = vi.fn();
const mockOnTTFB = vi.fn();

vi.mock('web-vitals', () => ({
  onCLS: mockOnCLS,
  onINP: mockOnINP,
  onFCP: mockOnFCP,
  onLCP: mockOnLCP,
  onTTFB: mockOnTTFB,
}));

describe('reportWebVitals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does nothing if onPerfEntry is not provided', () => {
    reportWebVitals();
    expect(mockOnCLS).not.toHaveBeenCalled();
    expect(mockOnINP).not.toHaveBeenCalled();
    expect(mockOnFCP).not.toHaveBeenCalled();
    expect(mockOnLCP).not.toHaveBeenCalled();
    expect(mockOnTTFB).not.toHaveBeenCalled();
  });

  it('does nothing if onPerfEntry is not a function', () => {
    reportWebVitals('not a function' as unknown);
    expect(mockOnCLS).not.toHaveBeenCalled();
    expect(mockOnINP).not.toHaveBeenCalled();
    expect(mockOnFCP).not.toHaveBeenCalled();
    expect(mockOnLCP).not.toHaveBeenCalled();
    expect(mockOnTTFB).not.toHaveBeenCalled();
  });

  it('calls web-vitals functions when onPerfEntry is provided', async () => {
    const mockOnPerfEntry = vi.fn();

    reportWebVitals(mockOnPerfEntry);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockOnCLS).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(mockOnINP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(mockOnFCP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(mockOnLCP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(mockOnTTFB).toHaveBeenCalledWith(mockOnPerfEntry);
  });
});
