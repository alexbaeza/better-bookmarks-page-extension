import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ItemSkeleton } from '@/shared/ui/ItemSkeleton';

describe('ItemSkeleton', () => {
  describe('grid variant', () => {
    it('should have grid-specific classes', () => {
      render(<ItemSkeleton variant="grid" />);
      const skeleton = screen.getByTestId('bookmark-skeleton-item');
      expect(skeleton).toHaveClass('w-24');
      expect(skeleton).toHaveClass('flex-col');
      expect(skeleton).toHaveClass('items-center');
    });

    it('should apply animate-pulse', () => {
      render(<ItemSkeleton variant="grid" />);
      const skeleton = screen.getByTestId('bookmark-skeleton-item');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should apply background color', () => {
      render(<ItemSkeleton variant="grid" />);
      const skeleton = screen.getByTestId('bookmark-skeleton-item');
      expect(skeleton).toHaveClass('bg-bgColor-secondary');
    });
  });

  describe('list variant', () => {
    it('should have list-specific classes', () => {
      render(<ItemSkeleton variant="list" />);
      const skeleton = screen.getByTestId('bookmark-skeleton-item');
      expect(skeleton).toHaveClass('h-12');
      expect(skeleton).toHaveClass('w-full');
      expect(skeleton).toHaveClass('rounded-lg');
    });

    it('should apply animate-pulse', () => {
      render(<ItemSkeleton variant="list" />);
      const skeleton = screen.getByTestId('bookmark-skeleton-item');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should apply background color', () => {
      render(<ItemSkeleton variant="list" />);
      const skeleton = screen.getByTestId('bookmark-skeleton-item');
      expect(skeleton).toHaveClass('bg-bgColor-secondary');
    });
  });

  describe('custom dataTestId', () => {
    it('should use custom dataTestId when provided', () => {
      render(<ItemSkeleton dataTestId="custom-skeleton" variant="grid" />);
      expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
    });

    it('should use default dataTestId when not provided', () => {
      render(<ItemSkeleton variant="grid" />);
      expect(screen.getByTestId('bookmark-skeleton-item')).toBeInTheDocument();
    });
  });

  describe('structure differences', () => {
    it('grid variant should render expected skeleton elements', () => {
      const { container } = render(<ItemSkeleton variant="grid" />);
      const placeholders = container.querySelectorAll('.bg-bgColor-primary\\/20');
      expect(placeholders.length).toBeGreaterThan(0);
    });

    it('list variant should render expected skeleton elements', () => {
      const { container } = render(<ItemSkeleton variant="list" />);
      const placeholders = container.querySelectorAll('.bg-bgColor-primary\\/20');
      expect(placeholders.length).toBeGreaterThan(0);
    });
  });
});
