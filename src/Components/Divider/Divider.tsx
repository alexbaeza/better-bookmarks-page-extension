import React from 'react';

export const Divider = ({ title }: { title: string }) => {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] place-items-center gap-4 p-2">
      <span className="w-full border-y border-text-primary"></span>
      <h4 className="w-fit text-xs text-text-primary">{title}</h4>
      <span className="w-full border-y border-text-primary"></span>
    </div>
  );
};
