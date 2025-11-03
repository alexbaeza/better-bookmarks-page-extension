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
    <div className="flex px-3 pt-3" data-testid="greeting">
      <div className="flex px-3 pt-3">
        <Text
          as="h1"
          className="text-title-1 mt-16 pr-3 md:mb-10"
          color="primary"
          data-testid="greeting-message"
          size="3xl"
          weight="bold"
        >
          {getGreeting() + (greetingEnabled && greetingName ? `, ${greetingName}` : '')}
        </Text>
      </div>
    </div>
  );
};
