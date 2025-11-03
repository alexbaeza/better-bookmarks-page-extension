import type React from 'react';

interface NotFoundIllustrationProps {
  className?: string;
}

export const NotFoundIllustration: React.FC<NotFoundIllustrationProps> = ({ className = '' }) => {
  return (
    <img alt="Page not found illustration" className={`mb-6 opacity-20 ${className}`} src="/images/not-found.svg" />
  );
};
