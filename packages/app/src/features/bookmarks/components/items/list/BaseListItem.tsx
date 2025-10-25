import { GripVertical } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ActionsOverlay } from './ActionsOverlay';

export interface BaseListItemProps {
  dataTestId?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export const BaseListItem: React.FC<BaseListItemProps> = ({ dataTestId, icon, children, href, onClick, onEdit, onDelete, dragHandleProps }) => {
  const [hovered, setHovered] = useState(false);
  const hideTimeout = useRef<number | undefined>(undefined);
  const ContentWrapper: React.ElementType = href ? 'a' : 'button';

  const clearHide = useCallback(() => {
    if (hideTimeout.current) {
      window.clearTimeout(hideTimeout.current);
      hideTimeout.current = undefined;
    }
  }, []);

  const scheduleHide = () => {
    clearHide();
    hideTimeout.current = window.setTimeout(() => {
      setHovered(false);
    }, 200);
  };

  useEffect(() => {
    return () => clearHide();
  }, [clearHide]);

  return (
    <div
      data-testid={dataTestId}
      onMouseEnter={() => {
        clearHide();
        setHovered(true);
      }}
      onMouseLeave={scheduleHide}
      className="
        relative flex h-12 w-full
        overflow-visible rounded-lg
        bg-bgColor-tertiary transition
        hover:bg-fgColor-hover
      "
    >
      {/* drag handle - outside clickable area */}
      <div className="bg-bgColor-secondary-contrast flex h-full w-8 flex-none items-center justify-center rounded-l-lg">
        <div
          {...dragHandleProps}
          className={`cursor-grab p-2 min-w-[32px] min-h-[32px] flex items-center justify-center ${hovered ? 'text-fgColor-primary' : 'text-fgColor-secondary'}`}
          data-testid="drag-handle-button"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={16} />
        </div>
      </div>

      {/* clickable content area */}
      <ContentWrapper href={href} onClick={onClick} className="flex h-full flex-1 items-center focus:outline-none">
        {/* icon */}
        <div className="flex h-full w-12 flex-none items-center justify-center">
          <div className={`${hovered ? 'text-fgColor-primary' : 'text-fgColor-secondary'}`}>{icon}</div>
        </div>

        {/* text */}
        <div className="overflow-hidden px-2 min-w-0">
          <div
            className={`line-clamp-2 break-words break-all hyphens-auto whitespace-normal text-xs ${
              hovered ? 'text-fgColor-primary' : 'text-fgColor-secondary'
            }`}
          >
            {children}
          </div>
        </div>
      </ContentWrapper>

      {/* edit/delete overlay */}
      <ActionsOverlay visible={hovered} onEdit={onEdit} onDelete={onDelete} onMouseEnter={clearHide} onMouseLeave={scheduleHide} />
    </div>
  );
};
