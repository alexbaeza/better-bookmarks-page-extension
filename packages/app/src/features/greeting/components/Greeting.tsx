import { useAtom } from 'jotai';

import { greetingEnabledAtom, greetingNameAtom } from '@/app/providers/atoms';
import { Text } from '@/shared/ui/Text';

const getGreeting = () => {
  const hour = new Date().getHours();
  let greeting: string;
  if (hour >= 5 && hour < 12) {
    greeting = 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }
  return greeting;
};

export const Greeting = () => {
  const [greetingEnabled] = useAtom(greetingEnabledAtom);
  const [greetingName] = useAtom(greetingNameAtom);

  return (
    <div className="flex p-6" data-testid="greeting">
      <Text as="h1" className="text-title-1" color="primary" data-testid="greeting-message" size="3xl" weight="bold">
        {getGreeting() + (greetingEnabled && greetingName ? `, ${greetingName}` : '')}
      </Text>
    </div>
  );
};
