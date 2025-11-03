import type React from 'react';

import { Text } from './Text';

export interface SettingCardProps {
  className?: string;
  description: string;
  title: string;
  toggle?: React.ReactNode;
}

export const SettingCard: React.FC<SettingCardProps> = ({ className = '', description, title, toggle }) => {
  return (
    <div className={`flex items-center justify-between bg-bgColor-primary rounded-lg p-4 ${className}`}>
      <div className="flex-1">
        <Text className="mb-1" size="sm" weight="medium">
          {title}
        </Text>
        <Text color="secondary" size="xs">
          {description}
        </Text>
      </div>
      {toggle && <div className="ml-4">{toggle}</div>}
    </div>
  );
};
