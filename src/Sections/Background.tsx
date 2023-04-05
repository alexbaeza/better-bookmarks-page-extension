import React from 'react';
import { useAtomValue } from 'jotai';
import {
  backgroundOverlayAtom,
  backgroundOverlayOpacityAtom
} from '../Context/atoms';

export const Background = () => {
  const selectedBackground = useAtomValue(backgroundOverlayAtom);

  const backgroundOverlayOpacity = useAtomValue(backgroundOverlayOpacityAtom);

  return (
    <div
      data-testid="background"
      className="h-full w-full flex-col bg-repeat p-1.5"
      style={{
        opacity: `${backgroundOverlayOpacity}%`,
        backgroundImage: `url('${selectedBackground}')`,
        position: 'fixed',
        top: 0,
        right: 0
      }}
    />
  );
};
