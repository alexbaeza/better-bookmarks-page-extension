import React from 'react';
import { useAtom } from 'jotai';
import { backgroundOverlayAtom } from '../../Context/atoms';
import { CheckIcon } from '../IconButton/Icons/Icons';

export const BackgroundSettings = () => {
  const [selectedBackground, setSelectedBackground] = useAtom(
    backgroundOverlayAtom
  );

  const handleImageClick = (image: string) => {
    setSelectedBackground(image);
  };

  const renderImage = (image: string, text: string) => {
    const isSelected = selectedBackground === image;
    const imgClasses = `h-24 w-36 rounded-xl border-4 border-custom-primary`;
    const containerClasses =
      'cursor-pointer mx-auto flex flex-col items-center justify-center relative';
    const textClasses = 'text-sm text-custom-text-primary text-center';

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
              className="text-custom-text-primary"
            />
          </div>
        )}
        <p className={textClasses}>{text}</p>
      </div>
    );
  };

  return (
    <>
      <div className="my-3 flex justify-between">
        <span className="text-sm font-bold text-custom-text-primary">
          Overlay
        </span>
      </div>
      <label
        className={`mb-2 block text-sm font-medium text-custom-text-primary`}
      >
        🌶️ Select an overlay, spice things up.
      </label>
      <div className="mx-auto grid w-full grid-cols-3">
        {renderImage('/images/transparent.png', 'None')}
        {renderImage('/images/doodle1.png', 'Doodle 1')}
        {renderImage('/images/doodle2.png', 'Doodle 2')}
      </div>
    </>
  );
};
