import { useAtom } from 'jotai';
import { CheckIcon } from 'lucide-react';
import type React from 'react';

import { backgroundOverlayAtom, backgroundOverlayOpacityAtom } from '@/app/providers/atoms';

interface BackgroundOverlaySettingsProps {
  dataTestId?: string;
}

export const BackgroundOverlaySettings = ({ dataTestId }: BackgroundOverlaySettingsProps) => {
  const [selectedBackground, setSelectedBackground] = useAtom(backgroundOverlayAtom);

  const [backgroundOverlayOpacity, setBackgroundOverlayOpacity] = useAtom(backgroundOverlayOpacityAtom);

  const handleImageClick = (image: string) => {
    setSelectedBackground(image);
  };

  const handleKeyDown = (event: React.KeyboardEvent, image: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleImageClick(image);
    }
  };

  const renderImage = (image: string, text: string) => {
    const isSelected = selectedBackground === image;
    const imgClasses = `h-16 w-24 rounded-lg border-2 bg-bgColor-secondary object-cover transition-all ${
      isSelected ? 'border-fgColor-accent shadow-lg scale-105' : 'border-fgColor-active hover:border-fgColor-secondary'
    }`;
    const containerClasses = 'cursor-pointer flex flex-col items-center justify-center relative group';
    const textClasses = `text-xs text-center mt-2 transition-colors ${
      isSelected ? 'text-fgColor-accent font-medium' : 'text-fgColor-secondary group-hover:text-fgColor-primary'
    }`;

    return (
      <button type="button" className={containerClasses} onClick={() => handleImageClick(image)} onKeyDown={(e) => handleKeyDown(e, image)}>
        <img className={imgClasses} src={image} alt={text} />
        {isSelected && (
          <div data-testid="background-check-icon-container" className="absolute -top-1 -right-1 p-1 bg-fgColor-accent rounded-full">
            <CheckIcon size={12} className="text-bgColor-primary" />
          </div>
        )}
        <p className={textClasses}>{text}</p>
      </button>
    );
  };

  const handleOpacityChange = (value: number) => {
    setBackgroundOverlayOpacity(value);
  };

  return (
    <div data-testid={dataTestId} className="space-y-4">
      <div className="text-sm text-fgColor-secondary">Add some personality to your background</div>

      {/* Overlay Selection */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-fgColor-primary">Choose an overlay</div>
        <div className="grid grid-cols-3 gap-4">
          {renderImage('/images/transparent.png', 'None')}
          {renderImage('/images/doodle1.png', 'Doodle 1')}
          {renderImage('/images/doodle2.png', 'Doodle 2')}
        </div>
      </div>

      {/* Opacity Control */}
      {selectedBackground !== '/images/transparent.png' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-fgColor-primary">Overlay Opacity</div>
            <div className="text-xs text-fgColor-secondary">{backgroundOverlayOpacity}%</div>
          </div>

          <div className="space-y-2">
            <input
              data-testid="background-overlay-opacity-slider"
              type="range"
              step={5}
              min="0"
              max="100"
              value={backgroundOverlayOpacity}
              onChange={(e) => handleOpacityChange(Number(e.target.value))}
              className="w-full h-2 bg-bgColor-tertiary rounded-lg appearance-none cursor-pointer accent-fgColor-accent"
            />
            <div className="flex justify-between text-xs text-fgColor-secondary">
              <span>Subtle</span>
              <span>Bold</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
