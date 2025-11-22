import { useFormik } from 'formik';
import { Bookmark, Folder, Globe } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef } from 'react';
import * as Yup from 'yup';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { Row } from '@/shared/ui/Row';
import { Stack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text';

export interface BookmarkFormModalProps {
  onClose: () => void;
  onSave: (values: { title: string; url?: string }) => void;
  initialValues?: { title: string; url?: string };
}

export const BookmarkFormModal: React.FC<BookmarkFormModalProps> = ({
  onClose,
  onSave,
  initialValues = { title: '', url: '' },
}) => {
  const isFolder = initialValues.url === undefined;
  const isEditing = !!initialValues.title;

  const modalTitle = isEditing
    ? isFolder
      ? 'Edit Folder'
      : 'Edit Bookmark'
    : isFolder
      ? 'Add Folder'
      : 'Add Bookmark';

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      onSave(values);
      onClose();
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      url: isFolder ? Yup.mixed().notRequired() : Yup.string().url('Invalid URL').nullable(),
    }),
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
    <Modal dataTestId="bookmark-form-modal" onClose={onClose} title={modalTitle}>
      <form onSubmit={formik.handleSubmit}>
        <Stack gap="xl">
          {/* Title Field */}
          <div>
            <label className="block" htmlFor="title">
              <Text className="mb-1" size="sm">
                Title
              </Text>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-fgColor-secondary">
                {isFolder ? (
                  <Folder className="text-fgColor-secondary" size={16} />
                ) : (
                  <Bookmark className="text-fgColor-secondary" size={16} />
                )}
              </div>
              <Input
                className="pl-10"
                dataTestId="bookmark-edit-title-input"
                id="title"
                name="title"
                onChange={formik.handleChange}
                placeholder="Enter title"
                value={formik.values.title}
              />
            </div>
            {formik.touched.title && formik.errors.title && (
              <Text className="mt-1" color="accent" size="xs">
                {formik.errors.title}
              </Text>
            )}
          </div>

          {/* URL Field (only in bookmark mode) */}
          {!isFolder && (
            <div>
              <label className="block" htmlFor="url">
                <Text className="mb-1" size="sm">
                  URL
                </Text>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-fgColor-secondary">
                  <Globe className="text-fgColor-secondary" size={16} />
                </div>
                <Input
                  className="pl-10"
                  data-testid="bookmark-edit-url-input"
                  id="url"
                  name="url"
                  onChange={formik.handleChange}
                  placeholder="https://example.com"
                  value={formik.values.url}
                />
              </div>
              {formik.touched.url && formik.errors.url && (
                <Text className="mt-1" color="accent" size="xs">
                  {formik.errors.url}
                </Text>
              )}
            </div>
          )}

          {/* Actions */}
          <Row gap="md" justifyContent="end">
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </Row>
        </Stack>
      </form>
    </Modal>
  );
};
