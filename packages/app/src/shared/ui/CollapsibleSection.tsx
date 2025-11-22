import { ChevronDown, ChevronUp } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import { Stack } from './Stack';
import { Text } from './Text';

export interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  dataTestId?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  defaultOpen = true,
  children,
  dataTestId,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-fgColor-secondary/20 pb-4 last:border-b-0" data-testid={dataTestId}>
      <button
        className="flex w-full items-center justify-between py-2 text-left hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="flex items-center gap-2">
          {icon && <div className="text-fgColor-secondary">{icon}</div>}
          <Text as="h4" color="primary" size="sm" weight="semibold">
            {title}
          </Text>
        </div>
        <div className="text-fgColor-secondary">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
      </button>
      {isOpen && (
        <div className="pt-2">
          <Stack gap="md">{children}</Stack>
        </div>
      )}
    </div>
  );
};
