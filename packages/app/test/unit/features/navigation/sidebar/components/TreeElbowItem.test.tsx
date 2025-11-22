import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TreeElbowItem } from '@/features/navigation/sidebar/components/TreeElbowItem';
import { AllProviders } from '~test/test-utils';

describe('TreeElbowItem', () => {
  it('renders children', () => {
    render(
      <AllProviders>
        <TreeElbowItem>
          <div data-testid="child-content">Child Content</div>
        </TreeElbowItem>
      </AllProviders>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('renders with correct structure and classes', () => {
    const { container } = render(
      <AllProviders>
        <TreeElbowItem>
          <div>Test</div>
        </TreeElbowItem>
      </AllProviders>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('relative', 'ml-6', 'min-w-0', 'overflow-visible');
  });
});
