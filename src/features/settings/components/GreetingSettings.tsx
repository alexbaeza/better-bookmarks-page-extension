import { useAtom } from 'jotai';
import type React from 'react';

import { greetingEnabledAtom, greetingNameAtom, greetingShownAtom } from '@/app/providers/atoms';
import { Input } from '@/shared/ui/Input';
import { Toggle } from '@/shared/ui/Toggle';

interface GreetingSettingsProps {
  dataTestId?: string;
}

export const GreetingSettings = ({ dataTestId }: GreetingSettingsProps) => {
  const [greetingEnabled, setGreetingEnabled] = useAtom(greetingEnabledAtom);
  const [greetingShown, setGreetingShown] = useAtom(greetingShownAtom);
  const [greetingName, setGreetingName] = useAtom(greetingNameAtom);

  const handleGreetingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGreetingName(e.target.value);
  };

  return (
    <div data-testid={dataTestId} className="space-y-4">
      <div className="text-sm text-fgColor-secondary">Add a personal touch to your bookmark experience</div>

      {/* Enable/Disable Main Greeting */}
      <div className="flex items-center justify-between bg-bgColor-primary rounded-lg p-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-fgColor-primary mb-1">Enable Greeting</div>
          <div className="text-xs text-fgColor-secondary">{greetingShown ? 'Greeting will be shown' : 'Greeting is hidden'}</div>
        </div>
        <Toggle data-testid="greeting-shown-toggle" checked={greetingShown} onChange={setGreetingShown} />
      </div>

      {/* Enable/Disable Personalization (only if greeting shown) */}
      {greetingShown && (
        <div className="flex items-center justify-between bg-bgColor-primary rounded-lg p-4">
          <div className="flex-1">
            <div className="text-sm font-medium text-fgColor-primary mb-1">Enable Personal Greeting</div>
            <div className="text-xs text-fgColor-secondary">{greetingEnabled ? 'Greeting is personalized' : 'Using default greeting'}</div>
          </div>
          <Toggle data-testid="greeting-enabled-toggle" checked={greetingEnabled} onChange={(val) => setGreetingEnabled(val)} />
        </div>
      )}

      {/* Name Input (only if greeting shown and personalized) */}
      {greetingShown && greetingEnabled && (
        <div className="space-y-3">
          <label htmlFor="greeting-settings-input" data-testid="greeting-settings-title" className="block text-sm font-medium text-fgColor-primary">
            What should we call you?
          </label>
          <Input
            id="greeting-settings-input"
            data-testid="greeting-settings-input"
            type="text"
            placeholder="Enter your name..."
            onChange={handleGreetingNameChange}
            value={greetingName}
          />
          {greetingName && <div className="text-xs text-fgColor-secondary">Preview: "Hello, {greetingName}! 👋"</div>}
        </div>
      )}
    </div>
  );
};
