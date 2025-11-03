import { useAtom } from 'jotai';
import type React from 'react';

import { greetingEnabledAtom, greetingNameAtom } from '@/app/providers/atoms';
import { Input } from '@/shared/ui/Input';
import { SettingCard } from '@/shared/ui/SettingCard';
import { Stack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text';
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
    <Stack data-testid={dataTestId} gap="lg">
      <Text color="secondary" size="sm">
        Add a personal touch to your bookmark experience
      </Text>

      {/* Enable/Disable Greeting (single toggle controls visibility & personalization) */}
      <SettingCard
        description={greetingEnabled ? 'Greeting is enabled' : 'Greeting is hidden'}
        title="Enable Greeting"
        toggle={
          <Toggle
            checked={greetingEnabled}
            data-testid="greeting-enabled-toggle"
            onChange={(val) => setGreetingEnabled(val)}
          />
        }
      />

      {/* Name Input (only if greeting shown and personalized) */}
      {greetingEnabled && (
        <Stack gap="md">
          <label className="block" data-testid="greeting-settings-title" htmlFor="greeting-settings-input">
            <Text size="sm" weight="medium">
              What should we call you?
            </Text>
          </label>
          <Input
            dataTestId="greeting-name-input"
            id="greeting-settings-input"
            onChange={handleGreetingNameChange}
            placeholder="Enter your name..."
            type="text"
            value={greetingName}
          />
          {greetingName && (
            <Text color="secondary" size="xs">
              Preview: "Hello, {greetingName}! 👋"
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
};
