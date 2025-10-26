import { useAtomValue } from 'jotai';
import type React from 'react';

import { backgroundOverlayAtom, backgroundOverlayOpacityAtom } from '@/app/providers/atoms';

export const BackgroundOverlay: React.FC = () => {
  const backgroundOverlay = useAtomValue(backgroundOverlayAtom);
  const backgroundOverlayOpacity = useAtomValue(backgroundOverlayOpacityAtom);

  if (!backgroundOverlay || backgroundOverlay === '/images/transparent.png') {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      data-testid="background-overlay"
      style={{
        backgroundImage: `url(${backgroundOverlay})`,
        backgroundPosition: 'top left',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        opacity: backgroundOverlayOpacity / 100,
      }}
    />
  );
};
