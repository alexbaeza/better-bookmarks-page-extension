import { useAtom } from 'jotai';

import { greetingEnabledAtom, greetingNameAtom } from '@/app/providers/atoms';
import { useTranslation } from '@/i18n/hooks';
import { Text } from '@/shared/ui/Text';

export const Greeting = () => {
  const { t } = useTranslation();
  const [greetingEnabled] = useAtom(greetingEnabledAtom);
  const [greetingName] = useAtom(greetingNameAtom);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t('greeting.goodMorning');
    if (hour >= 12 && hour < 18) return t('greeting.goodAfternoon');
    return t('greeting.goodEvening');
  };

  return (
    <div className="flex p-6" data-testid="greeting">
      <Text as="h1" className="text-title-1" color="primary" data-testid="greeting-message" size="3xl" weight="bold">
        {getGreeting() + (greetingEnabled && greetingName ? `, ${greetingName}` : '')}
      </Text>
    </div>
  );
};
