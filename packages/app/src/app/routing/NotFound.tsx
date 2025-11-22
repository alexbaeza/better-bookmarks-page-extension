import type React from 'react';
import { NotFoundIllustration } from '@/features/navigation/components/NotFoundIllustration';
import { useTranslation } from '@/i18n/hooks';
import { Content } from '@/shared/ui/Content';
import { Row } from '@/shared/ui/Row';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Row alignItems="center" className="size-full" gap="none" justifyContent="center">
      <Content padding>
        <div className="flex flex-col items-center">
          <NotFoundIllustration className="mb-4 text-bgColor-secondary" />
          <p className="text-center text-lg font-semibold text-fgColor-primary">
            {t('notFound.title')} – {t('notFound.message')}
          </p>
        </div>
      </Content>
    </Row>
  );
};
