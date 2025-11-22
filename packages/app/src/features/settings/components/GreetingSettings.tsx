import { useAtom } from 'jotai';
import type React from 'react';

import { greetingEnabledAtom, greetingNameAtom } from '@/app/providers/atoms';
import { useTranslation } from '@/i18n/hooks';
import { Input } from '@/shared/ui/Input';
import { SettingCard } from '@/shared/ui/SettingCard';
import { SettingItem } from '@/shared/ui/SettingItem';
import { Stack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text';
import { Toggle } from '@/shared/ui/Toggle';

interface GreetingSettingsProps {
  dataTestId?: string;
}

export const GreetingSettings = ({ dataTestId }: GreetingSettingsProps) => {
  const { t } = useTranslation();
  const [greetingEnabled, setGreetingEnabled] = useAtom(greetingEnabledAtom);
  const [greetingName, setGreetingName] = useAtom(greetingNameAtom);

  const handleGreetingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGreetingName(e.target.value);
  };

  return (
    <Stack data-testid={dataTestId} gap="md">
      <SettingItem description={t('settings.greeting.description')}>
        <SettingCard
          description={greetingEnabled ? t('settings.greeting.enabled') : t('settings.greeting.hidden')}
          title={t('settings.greeting.enableTitle')}
          toggle={
            <Toggle
              checked={greetingEnabled}
              data-testid="greeting-enabled-toggle"
              onChange={(val) => setGreetingEnabled(val)}
            />
          }
        />
      </SettingItem>

      {/* Name Input (only if greeting shown and personalized) */}
      {greetingEnabled && (
        <SettingItem label={t('settings.greeting.nameLabel')}>
          <Input
            dataTestId="greeting-name-input"
            id="greeting-settings-input"
            onChange={handleGreetingNameChange}
            placeholder={t('settings.greeting.namePlaceholder')}
            type="text"
            value={greetingName}
          />
          {greetingName && (
            <Text className="mt-1" color="secondary" size="xs">
              {t('settings.greeting.preview', { name: greetingName })}
            </Text>
          )}
        </SettingItem>
      )}
    </Stack>
  );
};
