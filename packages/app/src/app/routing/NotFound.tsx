import type React from 'react';

import { NotFoundIllustration } from '@/features/navigation/components/NotFoundIllustration';
import { Content } from '@/shared/ui/Content';
import { Row } from '@/shared/ui/Row';

export const NotFoundPage: React.FC = () => (
  <Row alignItems="center" className="size-full" gap="none" justifyContent="center">
    <Content padding>
      <div className="flex flex-col items-center">
        <NotFoundIllustration className="mb-4 text-bgColor-secondary" />
        <p className="text-center text-lg font-semibold text-fgColor-primary">404 – Page not found</p>
      </div>
    </Content>
  </Row>
);
