import { render, screen } from '@testing-library/react';

import { SidebarSection } from '@/features/navigation/sidebar/components/SideBarSection';

describe('SidebarSection', () => {
  it('renders section with title only', () => {
    render(
      <SidebarSection title="Test Section">
        <li>Test Item</li>
      </SidebarSection>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renders section with title and icon', () => {
    const TestIcon = () => <span data-testid="test-icon">📁</span>;

    render(
      <SidebarSection icon={<TestIcon />} title="Test Section">
        <li>Test Item</li>
      </SidebarSection>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renders section with title, icon, and badge', () => {
    const TestIcon = () => <span data-testid="test-icon">📁</span>;

    render(
      <SidebarSection badge={5} icon={<TestIcon />} title="Test Section">
        <li>Test Item</li>
      </SidebarSection>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renders section with badge only (no icon)', () => {
    render(
      <SidebarSection badge={3} title="Test Section">
        <li>Test Item</li>
      </SidebarSection>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renders section with badge of 0', () => {
    render(
      <SidebarSection badge={0} title="Test Section">
        <li>Test Item</li>
      </SidebarSection>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <SidebarSection title="Test Section">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </SidebarSection>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('applies correct CSS classes to title', () => {
    render(
      <SidebarSection title="Test Section">
        <li>Test Item</li>
      </SidebarSection>
    );

    const title = screen.getByText('Test Section').closest('h4');
    expect(title).toHaveClass('mb-1', 'flex', 'items-center', 'gap-2', 'text-xs', 'font-semibold', 'uppercase', 'text-fgColor-secondary', 'min-w-0');
  });

  it('applies correct CSS classes to badge', () => {
    render(
      <SidebarSection badge={5} title="Test Section">
        <li>Test Item</li>
      </SidebarSection>
    );

    const badge = screen.getByText('5');
    expect(badge).toHaveClass(
      'flex-none',
      'rounded-full',
      'bg-bgColor-tertiary',
      'px-2',
      'py-0.5',
      'text-xs',
      'text-fgColor-secondary',
      'min-w-[1.5rem]',
      'text-center'
    );
  });

  it('applies correct CSS classes to children container', () => {
    render(
      <SidebarSection title="Test Section">
        <li>Test Item</li>
      </SidebarSection>
    );

    const container = screen.getByText('Test Item').closest('ul');
    expect(container).toHaveClass('min-w-0');
  });
});
