import React from 'react';
import { useAtom } from 'jotai';
import {
  backgroundOverlayAtom,
  backgroundOverlayOpacityAtom
} from '../../Context/atoms';
import { CheckIcon } from '../IconButton/Icons/Icons';

export const BackgroundSettings = () => {
  const [selectedBackground, setSelectedBackground] = useAtom(
    backgroundOverlayAtom
  );

  const [backgroundOverlayOpacity, setBackgroundOverlayOpacity] = useAtom(
    backgroundOverlayOpacityAtom
  );

  const handleImageClick = (image: string) => {
    setSelectedBackground(image);
  };

  const renderImage = (image: string, text: string) => {
    const isSelected = selectedBackground === image;
    const imgClasses = `h-24 w-36 rounded-xl border-4 border-accent`;
    const containerClasses =
      'cursor-pointer mx-auto flex flex-col items-center justify-center relative';
    const textClasses = 'text-sm text-text-primary text-center';

    return (
      <div className={containerClasses} onClick={() => handleImageClick(image)}>
        <img className={imgClasses} src={image} alt={text} />
        {isSelected && (
          <div
            data-testid="background-check-icon-container"
            className="absolute top-0 right-0 p-2"
          >
            <CheckIcon
              dataTestId="background-check-icon"
              size="sm"
              className="text-accent"
            />
          </div>
        )}
        <p className={textClasses}>{text}</p>
      </div>
    );
  };

  const handleOpacityChange = (value: number) => {
    setBackgroundOverlayOpacity(value);
  };

  return (
    <>
      <div className="w-full">
        <div className="my-3 flex justify-between">
          <span className="text-sm font-bold text-text-primary">Overlay</span>
        </div>
        <label className={`mb-2 block text-sm font-medium text-text-primary`}>
          🌶️ Select an overlay, spice things up.
        </label>
        <div className="mx-auto grid w-full grid-cols-3">
          {renderImage('/images/transparent.png', 'None')}
          {renderImage('/images/doodle1.png', 'Doodle 1')}
          {renderImage('/images/doodle2.png', 'Doodle 2')}
        </div>
        <div className="my-3 flex justify-between">
          <span className="text-sm font-bold text-text-primary">
            Overlay Opacity
          </span>
        </div>
        <label className={`mb-2 block text-sm font-medium text-text-primary`}>
          ⭐ Change the opacity of the overlay to match your desired style.
        </label>

        <input
          type="range"
          step={10}
          min="0"
          max="100"
          value={backgroundOverlayOpacity}
          onChange={(e) => handleOpacityChange(Number(e.target.value))}
          className="range mt-2 w-full accent-secondary-dark"
        />
      </div>
    </>
  );
};
