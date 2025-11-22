import type React from 'react';

import { Stack } from './Stack';
import { Text } from './Text';

export interface SettingItemProps {
  label?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  label,
  description,
  children,
  className = '',
  dataTestId,
}) => {
  return (
    <div className={className} data-testid={dataTestId}>
      <Stack gap="sm">
        {label && (
          <div>
            <Text size="sm" weight="medium">
              {label}
            </Text>
          </div>
        )}
        {description && (
          <Text color="secondary" size="sm">
            {description}
          </Text>
        )}
        <div>{children}</div>
      </Stack>
    </div>
  );
};
