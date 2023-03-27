import React from 'react';
import { useAtom } from 'jotai';
import { greetingEnabledAtom, greetingNameAtom } from '../../Context/atoms';

const getGreeting = () => {
  const hour = new Date().getHours();
  let greeting;
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
    <div className="px-3 pt-3">
      <h1 className="text-title-1 mt-16 pr-3 text-3xl font-bold  text-custom-text-primary md:mb-10">
        {getGreeting() + (greetingEnabled ? `, ${greetingName}` : '')}
      </h1>
    </div>
  );
};
