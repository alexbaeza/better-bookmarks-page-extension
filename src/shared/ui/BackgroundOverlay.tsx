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
      style={{
        backgroundImage: `url(${backgroundOverlay})`,
        backgroundSize: 'auto',
        backgroundPosition: 'top left',
        backgroundRepeat: 'repeat',
        opacity: backgroundOverlayOpacity / 100,
      }}
    />
  );
};
