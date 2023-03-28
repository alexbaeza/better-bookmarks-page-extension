import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  className?: string;
  icon: any;
  dataTestId?: string;
}

export const IconButton = ({
  dataTestId,
  className,
  onClick,
  icon
}: IconButtonProps) => {
  return (
    <button
      data-testid={dataTestId}
      type="button"
      className={
        className +
        ' absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-secondary-dark p-1.5 text-sm text-text-primary hover:bg-secondary-dark-active hover:text-white'
      }
      onClick={onClick}
    >
      {icon}
    </button>
  );
};
