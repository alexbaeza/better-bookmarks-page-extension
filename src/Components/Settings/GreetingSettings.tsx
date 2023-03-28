import React from 'react';
import { useAtom } from 'jotai';
import { greetingEnabledAtom, greetingNameAtom } from '../../Context/atoms';
interface GreetingSettingsProps {
  dataTestId?: string;
}

export const GreetingSettings = ({ dataTestId }: GreetingSettingsProps) => {
  const [greetingEnabled, setGreetingEnabled] = useAtom(greetingEnabledAtom);
  const [greetingName, setGreetingName] = useAtom(greetingNameAtom);

  const handleGreetingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGreetingName(e.target.value);
  };

  const inputClassEnabled =
    'mb-6 block w-full rounded-lg border border-secondary-dark bg-secondary-dark p-2.5 text-sm text-text-primary placeholder-gray-400 focus:border-primary focus:border-primary focus:ring-4 focus:ring-primary';
  const inputClassDisabled =
    'mb-6 block w-full cursor-not-allowed rounded-lg border border-secondary-dark bg-secondary-dark-muted p-2.5 text-sm text-text-primary-muted';

  const inputClass = greetingEnabled ? inputClassEnabled : inputClassDisabled;
  return (
    <>
      <div data-testid={dataTestId} className="my-3 flex justify-between">
        <span className="text-sm font-bold text-text-primary">Greeting</span>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            data-testid="greeting-settings-toggle"
            onClick={() => setGreetingEnabled(!greetingEnabled)}
            type="checkbox"
            value=""
            className="peer sr-only"
            defaultChecked={greetingEnabled}
          />
          <div className="peer h-6 w-11 rounded-full border-gray-600 bg-gray-700 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-accent"></div>
        </label>
      </div>
      <label
        data-testid="greeting-settings-title"
        className={`mb-2 block text-sm font-medium text-text-primary ${
          greetingEnabled ? '' : 'text-text-primary-muted'
        }`}
      >
        🤝 What should we call you?
      </label>
      <input
        data-testid="greeting-settings-input"
        type="text"
        className={inputClass}
        disabled={!greetingEnabled}
        onChange={handleGreetingNameChange}
        value={greetingName}
      />
    </>
  );
};
