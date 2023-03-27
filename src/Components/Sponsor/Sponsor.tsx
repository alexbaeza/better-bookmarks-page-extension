import React from 'react';

export const Sponsor = () => {
  return (
    <>
      <div className="mt-2 flex w-full flex-row justify-end text-xs text-custom-text-primary">
        {
          'This app was built with the intentions of it being free to the public as well as open-sourced but if you like it and it helps you, you can always buy me a coffee.'
        }
      </div>
      <div className="mt-3 flex justify-center">
        <a href={'https://www.buymeacoffee.com/alexbaeza'}>
          <img
            className="w-32"
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt={'Buy me a coffee'}
          />
        </a>
      </div>
    </>
  );
};
