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

  const renderImage = (image: string, text: string, index: number) => {
    const isSelected = selectedBackground === image;
    const imgClasses = `h-16 w-24 rounded-lg border-2 bg-bgColor-secondary object-cover transition-all ${
      isSelected ? 'border-fgColor-accent shadow-lg scale-105' : 'border-fgColor-active hover:border-fgColor-secondary'
    }`;
    const containerClasses = 'cursor-pointer flex flex-col items-center justify-center relative group';
    const textClasses = `text-xs text-center mt-2 transition-colors ${
      isSelected ? 'text-fgColor-accent font-medium' : 'text-fgColor-secondary group-hover:text-fgColor-primary'
    }`;

    return (
      <button
        className={containerClasses}
        data-testid={`background-overlay-option-${index}`}
        onClick={() => handleImageClick(image)}
        onKeyDown={(e) => handleKeyDown(e, image)}
        type="button"
      >
        <img alt={text} className={imgClasses} src={image} />
        {isSelected && (
          <div className="absolute -top-1 -right-1 p-1 bg-fgColor-accent rounded-full" data-testid="background-check-icon-container">
            <CheckIcon className="text-bgColor-primary" size={12} />
          </div>
        )}
        <p className={textClasses}>{text}</p>
      </button>
    );
  };

  const handleOpacityChange = (value: number) => {
    setBackgroundOverlayOpacity(value);
  };

  const overlayOptions = [
    { image: '/images/doodle1.png', text: 'Doodle 1' },
    { image: '/images/doodle2.png', text: 'Doodle 2' },
  ];

  return (
    <div className="space-y-4" data-testid={dataTestId}>
      <div className="text-sm text-fgColor-secondary">Add some personality to your background</div>

      {/* Enable/Disable Background Overlay */}
      <div className="flex items-center justify-between bg-bgColor-primary rounded-lg p-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-fgColor-primary mb-1">Enable Background Overlay</div>
          <div className="text-xs text-fgColor-secondary">
            {selectedBackground !== '/images/transparent.png' ? 'Overlay is enabled' : 'Overlay is disabled'}
          </div>
        </div>
        <div
          aria-checked={selectedBackground !== '/images/transparent.png'}
          className="relative inline-flex cursor-pointer items-center"
          data-testid="background-overlay-toggle"
          onClick={() => setSelectedBackground(selectedBackground !== '/images/transparent.png' ? '/images/transparent.png' : '/images/doodle1.png')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedBackground(selectedBackground !== '/images/transparent.png' ? '/images/transparent.png' : '/images/doodle1.png');
            }
          }}
          role="switch"
          tabIndex={0}
        >
          <input
            checked={selectedBackground !== '/images/transparent.png'}
            className="peer sr-only"
            onChange={(e) => setSelectedBackground(e.target.checked ? '/images/doodle1.png' : '/images/transparent.png')}
            type="checkbox"
          />
          <div className="peer h-6 w-11 rounded-full bg-bgColor-tertiary peer-checked:bg-bgColor-accent after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-fgColor-primary after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-fgColor-primary" />
        </div>
      </div>

      {/* Overlay Selection - only when overlay is enabled */}
      {selectedBackground !== '/images/transparent.png' && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-fgColor-primary">Choose an overlay</div>
          <div className="grid grid-cols-3 gap-4">
            {overlayOptions.map((opt, idx) => (
              <div key={opt.image}>{renderImage(opt.image, opt.text, idx)}</div>
            ))}
          </div>
        </div>
      )}

      {/* Opacity Control */}
      {selectedBackground !== '/images/transparent.png' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-fgColor-primary">Overlay Opacity</div>
            <div className="text-xs text-fgColor-secondary">{backgroundOverlayOpacity}%</div>
          </div>

          <div className="space-y-2">
            <input
              className="w-full h-2 bg-bgColor-tertiary rounded-lg appearance-none cursor-pointer accent-fgColor-accent"
              data-testid="background-overlay-opacity-slider"
              max="100"
              min="0"
              onChange={(e) => handleOpacityChange(Number(e.target.value))}
              step={5}
              type="range"
              value={backgroundOverlayOpacity}
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
