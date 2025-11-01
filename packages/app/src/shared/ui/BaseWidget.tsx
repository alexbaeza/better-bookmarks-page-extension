import { GripVertical, Maximize2, Minimize2, Settings, X } from 'lucide-react';
import React, { useState } from 'react';
import type { BaseWidget } from '@/shared/types/widgets';
import { IconButton } from '@/shared/ui/IconButton';

export interface BaseWidgetContainerProps {
  widget: BaseWidget;
  children: React.ReactNode;
  onRemove?: (widgetId: string) => void;
  onSettings?: (widgetId: string) => void;
  onMinimize?: (widgetId: string) => void;
  onMaximize?: (widgetId: string) => void;
  onResizeStart?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  isDragging?: boolean;
  isEditMode?: boolean;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
}

export const BaseWidgetContainer = React.forwardRef<HTMLDivElement, BaseWidgetContainerProps>(
  (
    { widget, children, onRemove, onSettings, onMinimize, onResizeStart, dragHandleProps, isDragging = false, isEditMode = false, className = '', style },
    forwardedRef
  ) => {
    const localRef = React.useRef<HTMLDivElement>(null);
    const ref = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`
        relative group rounded-lg border border-bgColor-tertiary
        bg-bgColor-secondary transition-all duration-200 shadow-sm
        ${isDragging ? 'opacity-0' : ''}
        ${widget.isMinimized ? 'h-12 overflow-hidden' : ''}
        ${widget.isMaximized ? 'fixed inset-4 z-50' : ''}
        ${isEditMode ? 'ring-2 ring-fgColor-accent ring-opacity-50 shadow-md' : 'hover:shadow-md'}
        ${className}
      `}
        data-testid={`widget-container-${widget.id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={ref}
        role="region"
        style={{
          backgroundColor: widget.config.backgroundColor,
          borderColor: widget.config.borderColor,
          ...style,
        }}
      >
        {/* Widget Header */}
        {widget.config.showHeader !== false && (
          <div className="flex items-center justify-between p-3 border-b border-bgColor-tertiary" {...dragHandleProps}>
            <div className="flex items-center space-x-2">
              {isEditMode && !widget.config.isLocked && (
                <div className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-bgColor-tertiary" {...dragHandleProps}>
                  <GripVertical className="text-fgColor-secondary" size={16} />
                </div>
              )}
              <h3 className="font-medium text-sm text-fgColor-primary">{widget.title}</h3>
            </div>

            {/* Widget Controls */}
            <div className={`flex items-center space-x-1 transition-opacity ${isHovered || isEditMode ? 'opacity-100' : 'opacity-0'}`}>
              {onMinimize && (
                <IconButton
                  dataTestId={`widget-minimize-${widget.id}`}
                  icon={widget.isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                  onClick={() => onMinimize(widget.id)}
                  size="sm"
                />
              )}
              {onSettings && (
                <IconButton dataTestId={`widget-settings-${widget.id}`} icon={<Settings size={14} />} onClick={() => onSettings(widget.id)} size="sm" />
              )}
              {onRemove && isEditMode && !widget.config.isLocked && (
                <IconButton dataTestId={`widget-remove-${widget.id}`} icon={<X size={14} />} onClick={() => onRemove(widget.id)} size="sm" />
              )}
            </div>
          </div>
        )}

        {/* Widget Content */}
        <div className={`p-3 ${widget.isMinimized ? 'hidden' : ''}`}>{children}</div>

        {/* Resize Handle */}
        {!widget.isMaximized && isEditMode && !widget.config.isLocked && onResizeStart && (
          <div
            className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize z-30 bg-transparent"
            data-testid={`resize-handle-${widget.id}`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onMouseDown={onResizeStart}
            role="button"
            style={{ touchAction: 'none' }}
            tabIndex={0}
            title="Resize widget"
          >
            <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-fgColor-accent bg-bgColor-secondary rounded-tl shadow-sm" />
          </div>
        )}
      </div>
    );
  }
);

export const WidgetComponent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className="w-full h-full">{children}</div>;
};
