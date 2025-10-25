import { act } from 'react';
import { vi } from 'vitest';

import { BookmarkFormModal } from '@/features/bookmarks/components/BookmarkFormModal';
import { fireEvent, render, screen, waitFor } from '~test/test-utils';

// Suppress console.error and console.warn for act warnings in this test file
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

describe('BookmarkFormModal', () => {
  beforeEach(() => {
    const portalRoot = document.createElement('div');
    portalRoot.id = 'modal-root';
    document.body.appendChild(portalRoot);
    // Suppress all console methods for act warnings
    console.error = vi.fn();
    console.warn = vi.fn();
    console.log = vi.fn();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    // Restore console methods
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.log = originalConsoleLog;
  });
  it('renders add bookmark modal', () => {
    const onClose = vi.fn();
    const onSave = vi.fn();

    render(<BookmarkFormModal onClose={onClose} onSave={onSave} />);

    expect(screen.getByText('Add Bookmark')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('URL')).toBeInTheDocument();
  });

  it('renders add folder modal', () => {
    const onClose = vi.fn();
    const onSave = vi.fn();

    render(<BookmarkFormModal onClose={onClose} onSave={onSave} initialValues={{ title: '', url: undefined }} />);

    expect(screen.getByText('Add Folder')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.queryByLabelText('URL')).not.toBeInTheDocument();
  });

  it('renders edit bookmark modal', () => {
    const onClose = vi.fn();
    const onSave = vi.fn();

    render(<BookmarkFormModal onClose={onClose} onSave={onSave} initialValues={{ title: 'Existing', url: 'http://example.com' }} />);

    expect(screen.getByText('Edit Bookmark')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing')).toBeInTheDocument();
    expect(screen.getByDisplayValue('http://example.com')).toBeInTheDocument();
  });

  it('renders edit folder modal', () => {
    const onClose = vi.fn();
    const onSave = vi.fn();

    render(<BookmarkFormModal onClose={onClose} onSave={onSave} initialValues={{ title: 'Existing Folder', url: undefined }} />);

    expect(screen.getByText('Edit Folder')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Folder')).toBeInTheDocument();
  });

  it('shows validation error for empty title', async () => {
    const onClose = vi.fn();
    const onSave = vi.fn();

    render(<BookmarkFormModal onClose={onClose} onSave={onSave} />);

    const submitButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid URL', async () => {
    const onClose = vi.fn();
    const onSave = vi.fn();

    render(<BookmarkFormModal onClose={onClose} onSave={onSave} />);

    const titleInput = screen.getByPlaceholderText('Enter title');
    const urlInput = screen.getByPlaceholderText('https://example.com');

    fireEvent.change(titleInput, { target: { value: 'Test' } });
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });

    const submitButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid URL')).toBeInTheDocument();
    });
  });

  it('calls onSave and onClose on valid submit', async () => {
    const onClose = vi.fn();
    const onSave = vi.fn();

    render(<BookmarkFormModal onClose={onClose} onSave={onSave} />);

    const titleInput = screen.getByPlaceholderText('Enter title');
    const urlInput = screen.getByPlaceholderText('https://example.com');

    fireEvent.change(titleInput, { target: { value: 'Test Bookmark' } });
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

    const submitButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        title: 'Test Bookmark',
        url: 'https://example.com',
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('calls onClose on cancel', async () => {
    const onClose = vi.fn();
    const onSave = vi.fn();

    await act(async () => {
      render(<BookmarkFormModal onClose={onClose} onSave={onSave} />);
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
