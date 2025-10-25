import { useFormik } from 'formik';
import { Bookmark, Folder, Globe } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef } from 'react';
import * as Yup from 'yup';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';

export interface BookmarkFormModalProps {
  onClose: () => void;
  onSave: (values: { title: string; url?: string }) => void;
  initialValues?: { title: string; url?: string };
}

export const BookmarkFormModal: React.FC<BookmarkFormModalProps> = ({ onClose, onSave, initialValues = { title: '', url: '' } }) => {
  const isFolder = initialValues.url === undefined;

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      url: isFolder ? Yup.mixed().notRequired() : Yup.string().url('Invalid URL').nullable(),
    }),
    onSubmit: (values) => {
      onSave(values);
      onClose();
    },
  });

  const prevInit = useRef(initialValues);
  useEffect(() => {
    const changed = prevInit.current.title !== initialValues.title || prevInit.current.url !== initialValues.url;
    if (changed) {
      formik.resetForm({ values: initialValues });
      prevInit.current = initialValues;
    }
  }, [initialValues, formik]);

  return (
    <Modal onClose={onClose} title={initialValues.title ? (isFolder ? 'Edit Folder' : 'Edit Bookmark') : isFolder ? 'Add Folder' : 'Add Bookmark'}>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm text-fgColor-primary">
            Title
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-fgColor-muted">
              {isFolder ? <Folder size={16} className="text-fgColor-muted" /> : <Bookmark size={16} className="text-fgColor-muted" />}
            </div>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              className="pl-10"
              placeholder="Enter title"
              data-testid="bookmark-edit-title-input"
            />
          </div>
          {formik.touched.title && formik.errors.title && <div className="mt-1 text-xs text-fgColor-danger">{formik.errors.title}</div>}
        </div>

        {/* URL Field (only in bookmark mode) */}
        {!isFolder && (
          <div>
            <label htmlFor="url" className="block text-sm text-fgColor-primary">
              URL
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-fgColor-muted">
                <Globe size={16} className="text-fgColor-muted" />
              </div>
              <Input
                id="url"
                name="url"
                value={formik.values.url}
                onChange={formik.handleChange}
                className="pl-10"
                placeholder="https://example.com"
                data-testid="bookmark-edit-url-input"
              />
            </div>
            {formik.touched.url && formik.errors.url && <div className="mt-1 text-xs text-fgColor-danger">{formik.errors.url}</div>}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
};
