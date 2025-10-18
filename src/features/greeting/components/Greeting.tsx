import { useAtom } from 'jotai';

import { greetingEnabledAtom, greetingNameAtom, greetingShownAtom } from '@/app/providers/atoms';

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
  const [greetingShown] = useAtom(greetingShownAtom);

  if (!greetingShown) {
    return null;
  }

  return (
    <div className="flex px-3 pt-3">
      <div className="flex px-3 pt-3">
        <h1 className="text-title-1 mt-16 pr-3 text-3xl font-bold  text-fgColor-primary md:mb-10">
          {getGreeting() + (greetingEnabled ? `, ${greetingName}` : '')}
        </h1>
      </div>
    </div>
  );
};
