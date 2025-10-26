import type React from 'react';

// @ts-expect-error
import notFoundSvg from '@/assets/images/not-found.svg';

interface NotFoundIllustrationProps {
  className?: string;
}

export const NotFoundIllustration: React.FC<NotFoundIllustrationProps> = ({ className = '' }) => {
  return <img alt="Page not found illustration" className={`mb-6 opacity-20 ${className}`} src={notFoundSvg} />;
};
