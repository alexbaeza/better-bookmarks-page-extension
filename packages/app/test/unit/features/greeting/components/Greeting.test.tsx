import { render, screen } from '@testing-library/react';
import * as jotai from 'jotai/index';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { greetingEnabledAtom, greetingNameAtom } from '@/app/providers/atoms';
import { Greeting } from '@/features/greeting/components/Greeting';

describe('Greeting', () => {
  let spy: vi.SpyInstance;
  beforeEach(() => {
    vi.restoreAllMocks();
    spy = vi.spyOn(jotai, 'useAtom');

    // Component renders when greetingEnabledAtom is true
    when(spy)
      .calledWith(greetingEnabledAtom)
      .thenReturn([true, vi.fn() as never]);
    when(spy)
      .calledWith(greetingNameAtom)
      .thenReturn(['Bob', vi.fn() as never]);
  });

  it('renders without errors', () => {
    render(<Greeting />);
    expect(screen.getByText(/Good/)).toBeInTheDocument();
  });

  it('displays the correct greeting message depending on the current time of day (morning)', () => {
    const mockDateObject = new Date('2023-03-27T09:00:00.000Z');
    vi.spyOn(global, 'Date').mockImplementation(function(this: any, ...args: any[]) {
      if (args.length === 0) {
        return mockDateObject;
      }
      return new (Date as any)(...args);
    });

    render(<Greeting />);
    expect(screen.getByText('Good Morning, Bob')).toBeInTheDocument();
  });

  it('displays the correct greeting message depending on the current time of day (afternoon)', () => {
    const mockDateObject = new Date('2023-03-27T13:00:00.000Z');
    vi.spyOn(global, 'Date').mockImplementation(function(this: any, ...args: any[]) {
      if (args.length === 0) {
        return mockDateObject;
      }
      return new (Date as any)(...args);
    });

    render(<Greeting />);
    expect(screen.getByText('Good Afternoon, Bob')).toBeInTheDocument();
  });

  it('displays the correct greeting message depending on the current time of day (evening)', () => {
    const mockDateObject = new Date('2023-03-27T19:00:00.000Z');
    vi.spyOn(global, 'Date').mockImplementation(function(this: any, ...args: any[]) {
      if (args.length === 0) {
        return mockDateObject;
      }
      return new (Date as any)(...args);
    });

    render(<Greeting />);
    expect(screen.getByText('Good Evening, Bob')).toBeInTheDocument();
  });

  it('displays the correct greeting message and name if the greeting is enabled and a name is provided', () => {
    const mockDateObject = new Date('2023-03-27T19:00:00.000Z');
    vi.spyOn(global, 'Date').mockImplementation(function(this: any, ...args: any[]) {
      if (args.length === 0) {
        return mockDateObject;
      }
      return new (Date as any)(...args);
    });

    render(<Greeting />);
    expect(screen.getByText('Good Evening, Bob')).toBeInTheDocument();
  });

  it('displays greeting without name when greetingEnabled is false', () => {
    when(spy)
      .calledWith(greetingEnabledAtom)
      .thenReturn([false, vi.fn() as never]);

    const mockDateObject = new Date('2023-03-27T19:00:00.000Z');
    vi.spyOn(global, 'Date').mockImplementation(function(this: any, ...args: any[]) {
      if (args.length === 0) {
        return mockDateObject;
      }
      return new (Date as any)(...args);
    });

    render(<Greeting />);
    expect(screen.getByText('Good Evening')).toBeInTheDocument();
    expect(screen.queryByText('Good Evening, Bob')).not.toBeInTheDocument();
  });
});
