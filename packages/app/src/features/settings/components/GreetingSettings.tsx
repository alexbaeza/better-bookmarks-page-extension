import { useAtom } from 'jotai';
import type React from 'react';

import { greetingEnabledAtom, greetingNameAtom } from '@/app/providers/atoms';
import { Input } from '@/shared/ui/Input';
import { Toggle } from '@/shared/ui/Toggle';

interface GreetingSettingsProps {
  dataTestId?: string;
}

export const GreetingSettings = ({ dataTestId }: GreetingSettingsProps) => {
  const [greetingEnabled, setGreetingEnabled] = useAtom(greetingEnabledAtom);
  const [greetingName, setGreetingName] = useAtom(greetingNameAtom);

  const handleGreetingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGreetingName(e.target.value);
  };

  return (
    <div data-testid={dataTestId} className="space-y-4">
      <div className="text-sm text-fgColor-secondary">Add a personal touch to your bookmark experience</div>

      {/* Enable/Disable Greeting (single toggle controls visibility & personalization) */}
      <div className="flex items-center justify-between bg-bgColor-primary rounded-lg p-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-fgColor-primary mb-1">Enable Greeting</div>
          <div className="text-xs text-fgColor-secondary">{greetingEnabled ? 'Greeting is enabled' : 'Greeting is hidden'}</div>
        </div>
        <Toggle data-testid="greeting-enabled-toggle" checked={greetingEnabled} onChange={(val) => setGreetingEnabled(val)} />
      </div>

      {/* Name Input (only if greeting shown and personalized) */}
      {greetingEnabled && (
        <div className="space-y-3">
          <label htmlFor="greeting-settings-input" data-testid="greeting-settings-title" className="block text-sm font-medium text-fgColor-primary">
            What should we call you?
          </label>
          <Input
            id="greeting-settings-input"
            data-testid="greeting-name-input"
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
