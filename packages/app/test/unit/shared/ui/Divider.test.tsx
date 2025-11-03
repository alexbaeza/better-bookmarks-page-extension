import { Divider } from '@/shared/ui/Divider';
import { render, screen } from '~test/test-utils';

describe('Divider', () => {
  it('renders the title', () => {
    render(<Divider title="Test Title" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('has the correct structure', () => {
    render(<Divider title="Test Title" />);

    const container = screen.getByText('Test Title').parentElement;
    expect(container).toHaveClass('grid grid-cols-[1fr_auto_1fr] place-items-center gap-4 p-2');

    const spans = container?.querySelectorAll('span');
    expect(spans).toHaveLength(2);
    if (spans) {
      for (const span of spans) {
        expect(span).toHaveClass('w-full border-y border-fgColor-primary');
      }
    }
  });

  it('applies correct classes to title', () => {
    render(<Divider title="Test Title" />);

    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('w-fit text-xs text-fgColor-primary');
  });
});
