import type React from 'react';

import { NotFoundIllustration } from '@/features/navigation/components/NotFoundIllustration';

export const NotFoundPage: React.FC = () => (
  <div className="flex size-full items-center justify-center p-4">
    <div className="flex flex-col items-center">
      <NotFoundIllustration className="mb-4 text-bgColor-tertiary" />
      <p className="text-center text-lg font-semibold text-fgColor-primary">404 – Page not found</p>
    </div>
  </div>
);
