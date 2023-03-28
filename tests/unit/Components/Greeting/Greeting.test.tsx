import { render, screen } from '@testing-library/react';
import { Greeting } from '../../../../src/Components/Greeting/Greeting';
import {
  greetingEnabledAtom,
  greetingNameAtom
} from '../../../../src/Context/atoms';
import * as jotai from 'jotai/index';
import { when } from 'jest-when';

describe('Greeting', () => {
  let spy;
  beforeEach(() => {
    jest.restoreAllMocks();
    spy = jest.spyOn(jotai, 'useAtom');

    when(spy)
      .calledWith(greetingEnabledAtom)
      .mockReturnValue([true, jest.fn() as never]);
    when(spy)
      .calledWith(greetingNameAtom)
      .mockReturnValue(['Bob', jest.fn() as never]);
  });

  it('renders without errors', () => {
    render(<Greeting />);
  });

  it('displays the correct greeting message depending on the current time of day (morning)', () => {
    const mockDateObject = new Date('2023-03-27T09:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDateObject);

    render(<Greeting />);
    expect(screen.getByText('Good Morning, Bob')).toBeInTheDocument();
  });

  it('displays the correct greeting message depending on the current time of day (afternoon)', () => {
    const mockDateObject = new Date('2023-03-27T13:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDateObject);

    render(<Greeting />);
    expect(screen.getByText('Good Afternoon, Bob')).toBeInTheDocument();
  });

  it('displays the correct greeting message depending on the current time of day (evening)', () => {
    const mockDateObject = new Date('2023-03-27T19:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDateObject);

    render(<Greeting />);
    expect(screen.getByText('Good Evening, Bob')).toBeInTheDocument();
  });

  it('displays the correct greeting message and name if the greeting is enabled and a name is provided', () => {
    const mockDateObject = new Date('2023-03-27T19:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDateObject);

    render(<Greeting />);
    expect(screen.getByText('Good Evening, Bob')).toBeInTheDocument();
  });
});
