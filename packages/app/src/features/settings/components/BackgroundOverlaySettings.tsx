import { useAtom } from 'jotai';
import { CheckIcon } from 'lucide-react';
import type React from 'react';

import { backgroundOverlayAtom, backgroundOverlayOpacityAtom } from '@/app/providers/atoms';
import { useTranslation } from '@/i18n/hooks';
import { Row } from '@/shared/ui/Row';
import { SettingCard } from '@/shared/ui/SettingCard';
import { SettingItem } from '@/shared/ui/SettingItem';
import { Stack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text';

interface BackgroundOverlaySettingsProps {
  dataTestId?: string;
}

export const BackgroundOverlaySettings = ({ dataTestId }: BackgroundOverlaySettingsProps) => {
  const { t } = useTranslation();
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
      isSelected
        ? 'border-fgColor-accent shadow-lg scale-105'
        : 'border-fgColor-secondary/30 hover:border-fgColor-secondary'
    }`;
    const containerClasses = 'cursor-pointer flex flex-col items-center justify-center relative group';

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
          <div
            className="absolute -top-1 -right-1 p-1 bg-fgColor-accent rounded-full"
            data-testid="background-check-icon-container"
          >
            <CheckIcon className="text-bgColor-primary" size={12} />
          </div>
        )}
        <Text
          className={`mt-2 text-center transition-colors ${
            isSelected ? 'text-fgColor-accent' : 'text-fgColor-secondary group-hover:text-fgColor-primary'
          }`}
          size="xs"
          weight={isSelected ? 'medium' : 'normal'}
        >
          {text}
        </Text>
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

  const isOverlayEnabled = selectedBackground !== '/images/transparent.png';

  const toggleOverlay = () => {
    const newBackground = isOverlayEnabled ? '/images/transparent.png' : '/images/doodle1.png';
    setSelectedBackground(newBackground);
  };

  const handleToggleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOverlay();
    }
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBackground = e.target.checked ? '/images/doodle1.png' : '/images/transparent.png';
    setSelectedBackground(newBackground);
  };

  return (
    <Stack data-testid={dataTestId} gap="md">
      <SettingItem
        description="Add some personality to your background"
        label={t('settings.backgroundOverlay.enableTitle')}
      >
        <SettingCard
          description={
            isOverlayEnabled
              ? t('settings.backgroundOverlay.enabled', { defaultValue: 'Overlay is enabled' })
              : t('settings.backgroundOverlay.disabled', { defaultValue: 'Overlay is disabled' })
          }
          title={t('settings.backgroundOverlay.enableTitle')}
          toggle={
            <div
              aria-checked={isOverlayEnabled}
              className="relative inline-flex cursor-pointer items-center"
              data-testid="background-overlay-toggle"
              onClick={toggleOverlay}
              onKeyDown={handleToggleKeyDown}
              role="switch"
              tabIndex={0}
            >
              <input
                checked={isOverlayEnabled}
                className="peer sr-only"
                onChange={handleToggleChange}
                type="checkbox"
              />
              <div className="peer h-6 w-11 rounded-full bg-bgColor-secondary peer-checked:bg-bgColor-accent after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-fgColor-primary after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-fgColor-primary" />
            </div>
          }
        />
      </SettingItem>

      {/* Overlay Selection - only when overlay is enabled */}
      {isOverlayEnabled && (
        <SettingItem label="Choose an overlay">
          <div className="grid grid-cols-3 gap-4">
            {overlayOptions.map((opt, idx) => (
              <div key={opt.image}>{renderImage(opt.image, opt.text, idx)}</div>
            ))}
          </div>
        </SettingItem>
      )}

      {/* Opacity Control */}
      {isOverlayEnabled && (
        <SettingItem label="Overlay Opacity">
          <Stack gap="sm">
            <Row alignItems="center" justifyContent="between">
              <Text color="secondary" size="xs">
                {backgroundOverlayOpacity}%
              </Text>
            </Row>
            <input
              className="w-full h-2 bg-bgColor-secondary rounded-lg appearance-none cursor-pointer accent-fgColor-accent"
              data-testid="background-overlay-opacity-slider"
              max="100"
              min="0"
              onChange={(e) => handleOpacityChange(Number(e.target.value))}
              step={5}
              type="range"
              value={backgroundOverlayOpacity}
            />
            <Row gap="none" justifyContent="between">
              <Text color="secondary" size="xs">
                Subtle
              </Text>
              <Text color="secondary" size="xs">
                Bold
              </Text>
            </Row>
          </Stack>
        </SettingItem>
      )}
    </Stack>
  );
};
