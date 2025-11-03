import { highlighter } from '@/features/bookmarks/lib/highlighter';
import { render, screen } from '~test/test-utils';

describe('highlighter', () => {
  it('returns text unchanged when query is empty', () => {
    const result = highlighter('Hello World', '');
    expect(result).toBe('Hello World');
  });

  it('returns text unchanged when query is not found', () => {
    const result = highlighter('Hello World', 'xyz');
    expect(result).toStrictEqual(['Hello World']);
  });

  it('highlights matching text case-insensitively', () => {
    const result = highlighter('Hello World', 'world');
    render(<div>{result}</div>);

    const mark = screen.getByText('World');
    expect(mark).toBeInTheDocument();
    expect(mark.tagName).toBe('MARK');
    expect(mark).toHaveClass('bg-bgColor-accent px-0.5 text-fgColor-primary');
  });

  it('highlights multiple occurrences', () => {
    const result = highlighter('Hello world, hello universe', 'hello');
    render(<div>{result}</div>);

    const marks = screen.getAllByText(/hello/i);
    expect(marks).toHaveLength(2);
    for (const mark of marks) {
      expect(mark.tagName).toBe('MARK');
    }
  });

  it('preserves non-matching parts', () => {
    const result = highlighter('Hello World', 'ello');
    render(<div>{result}</div>);

    const mark = screen.getByText('ello');
    expect(mark.tagName).toBe('MARK');

    const container = screen.getByText('ello').parentElement;
    expect(container).toHaveTextContent('Hello World');
  });

  it('handles exact match', () => {
    const result = highlighter('test', 'test');
    render(<div>{result}</div>);

    const mark = screen.getByText('test');
    expect(mark.tagName).toBe('MARK');
  });
});
