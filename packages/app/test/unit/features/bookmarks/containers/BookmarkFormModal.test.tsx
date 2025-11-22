import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BookmarkFormModal } from '@/features/bookmarks/containers/BookmarkFormModal';
import { AllProviders } from '~test/test-utils';

let mockOnClose = vi.fn<() => void>();
let mockOnSave = vi.fn<() => void>();
let mockFormik: {
  values: { title: string; url: string | undefined };
  errors: Record<string, unknown>;
  touched: Record<string, unknown>;
  handleChange: ReturnType<typeof vi.fn>;
  handleSubmit: ReturnType<typeof vi.fn>;
  resetForm: ReturnType<typeof vi.fn>;
  setValues: ReturnType<typeof vi.fn>;
} = {
  values: { title: '', url: '' },
  errors: {},
  touched: {},
  handleChange: vi.fn(),
  handleSubmit: vi.fn(),
  resetForm: vi.fn(),
  setValues: vi.fn(),
};

vi.mock('formik', () => ({
  useFormik: () => mockFormik,
}));

vi.mock('@/shared/ui/Modal', () => ({
  Modal: ({
    children,
    dataTestId,
    title,
    onClose,
  }: {
    children: React.ReactNode;
    dataTestId?: string;
    title: string;
    onClose: () => void;
  }) => (
    <div data-testid={dataTestId || 'modal'}>
      <div data-testid="modal-title">{title}</div>
      <button data-testid="modal-close" onClick={onClose} type="button">
        Close
      </button>
      {children}
    </div>
  ),
}));

describe('BookmarkFormModal', () => {
  let folderProps: {
    onClose: ReturnType<typeof vi.fn<() => void>>;
    onSave: ReturnType<typeof vi.fn<() => void>>;
    initialValues: { title: string; url: undefined };
  };
  let bookmarkProps: {
    onClose: ReturnType<typeof vi.fn<() => void>>;
    onSave: ReturnType<typeof vi.fn<() => void>>;
    initialValues: { title: string; url: string };
  };

  beforeEach(() => {
    mockOnClose = vi.fn<() => void>();
    mockOnSave = vi.fn<() => void>();
    mockFormik = {
      values: { title: '', url: '' },
      errors: {},
      touched: {},
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
      setValues: vi.fn(),
    };

    folderProps = {
      onClose: mockOnClose,
      onSave: mockOnSave,
      initialValues: { title: '', url: undefined },
    };

    bookmarkProps = {
      onClose: mockOnClose,
      onSave: mockOnSave,
      initialValues: { title: '', url: '' },
    };
  });

  describe('Folder mode (url is undefined)', () => {
    it('renders modal with correct title for adding folder', () => {
      mockFormik.values = { title: '', url: undefined };

      render(
        <AllProviders>
          <BookmarkFormModal {...folderProps} />
        </AllProviders>
      );

      expect(screen.getByTestId('bookmark-form-modal')).toBeInTheDocument();
      expect(screen.getByText('Add Bookmark')).toBeInTheDocument();
    });

    it('renders modal with correct title for editing folder', () => {
      mockFormik.values = { title: 'Existing Folder', url: undefined };

      render(
        <AllProviders>
          <BookmarkFormModal {...folderProps} initialValues={{ title: 'Existing Folder', url: undefined }} />
        </AllProviders>
      );

      expect(screen.getByText('Edit Bookmark')).toBeInTheDocument();
    });

    it('renders folder icon in title input', () => {
      mockFormik.values = { title: '', url: undefined };

      render(
        <AllProviders>
          <BookmarkFormModal {...folderProps} />
        </AllProviders>
      );

      expect(screen.getByTestId('bookmark-edit-title-input')).toBeInTheDocument();
      const inputContainer = screen.getByTestId('bookmark-edit-title-input').parentElement;
      expect(inputContainer).toHaveClass('relative');
    });

    it('does not render URL field for folders', () => {
      mockFormik.values = { title: '', url: undefined };

      render(
        <AllProviders>
          <BookmarkFormModal {...folderProps} />
        </AllProviders>
      );

      expect(screen.queryByTestId('bookmark-edit-url-input')).toBeNull();
    });

    it('calls onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      mockFormik.values = { title: '', url: undefined };

      render(
        <AllProviders>
          <BookmarkFormModal {...folderProps} />
        </AllProviders>
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Bookmark mode (url is string)', () => {
    it('renders modal with correct title for adding bookmark', () => {
      mockFormik.values = { title: '', url: '' };

      render(
        <AllProviders>
          <BookmarkFormModal {...bookmarkProps} />
        </AllProviders>
      );

      expect(screen.getByText('Add Bookmark')).toBeInTheDocument();
    });

    it('renders modal with correct title for editing bookmark', () => {
      mockFormik.values = { title: 'Existing Bookmark', url: 'https://example.com' };

      render(
        <AllProviders>
          <BookmarkFormModal
            {...bookmarkProps}
            initialValues={{ title: 'Existing Bookmark', url: 'https://example.com' }}
          />
        </AllProviders>
      );

      expect(screen.getByText('Edit Bookmark')).toBeInTheDocument();
    });

    it('renders bookmark icon in title input', () => {
      mockFormik.values = { title: '', url: '' };

      render(
        <AllProviders>
          <BookmarkFormModal {...bookmarkProps} />
        </AllProviders>
      );

      expect(screen.getByTestId('bookmark-edit-title-input')).toBeInTheDocument();
    });

    it('renders URL field for bookmarks', () => {
      mockFormik.values = { title: '', url: '' };

      render(
        <AllProviders>
          <BookmarkFormModal {...bookmarkProps} />
        </AllProviders>
      );

      expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument(); // URL input placeholder
      expect(screen.getByText('URL')).toBeInTheDocument();
    });
  });

  describe('Default initial values', () => {
    it('uses default empty values when initialValues is not provided', () => {
      mockFormik.values = { title: '', url: '' };

      render(
        <AllProviders>
          <BookmarkFormModal onClose={mockOnClose} onSave={mockOnSave} />
        </AllProviders>
      );

      expect(screen.getByTestId('bookmark-edit-title-input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument();
    });
  });

  describe('Form styling', () => {
    it('applies correct CSS classes to form elements', () => {
      mockFormik.values = { title: '', url: '' };

      render(
        <AllProviders>
          <BookmarkFormModal initialValues={{ title: '', url: '' }} onClose={mockOnClose} onSave={mockOnSave} />
        </AllProviders>
      );

      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();

      const stack = document.querySelector('.space-y-6');
      expect(stack).toBeInTheDocument();

      const row = document.querySelector('.justify-end');
      expect(row).toBeInTheDocument();
    });
  });
});
