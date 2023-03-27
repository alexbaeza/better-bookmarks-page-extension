import React from 'react';
import { useAtom } from 'jotai';
import { greetingEnabledAtom, greetingNameAtom } from '../../Context/atoms';

export const GreetingSettings = () => {
  const [greetingEnabled, setGreetingEnabled] = useAtom(greetingEnabledAtom);
  const [greetingName, setGreetingName] = useAtom(greetingNameAtom);

  const handleGreetingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGreetingName(e.target.value);
  };

  return (
    <>
      <div className="my-3 flex justify-between">
        <span className="text-sm font-bold text-custom-text-primary">Greeting</span>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            onClick={() => setGreetingEnabled(!greetingEnabled)}
            type="checkbox"
            value=""
            className="peer sr-only"
            checked={greetingEnabled}
          />
          <div className="peer h-6 w-11 rounded-full border-gray-600 bg-gray-700 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-custom-primary"></div>
        </label>
      </div>
      <label
        className={`mb-2 block text-sm font-medium text-custom-text-primary ${
          greetingEnabled ? '' : 'text-custom-text-primary-muted'
        }`}
      >
        🤝 What should we call you?
      </label>
      {greetingEnabled ? (
        <input
          type="text"
          className="mb-6 block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-custom-primary focus:border-custom-primary focus:ring-4 focus:ring-custom-primary "
          onChange={handleGreetingNameChange}
          value={greetingName}
        />
      ) : (
        <input
          type="text"
          className="mb-6 block w-full cursor-not-allowed rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-custom-text-primary-muted"
          disabled
          value={greetingName}
        />
      )}
    </>
  );
};
