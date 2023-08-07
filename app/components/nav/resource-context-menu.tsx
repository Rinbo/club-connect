import React from 'react';

export default function ResourceContextMenu({ children, animate = true }: { children: React.ReactNode; animate?: boolean }) {
  return (
    <ul
      className={`${
        animate && 'menu-animate-down'
      } no-scrollbar menu rounded-box menu-horizontal menu-xs w-full flex-nowrap gap-2 overflow-x-auto bg-base-200 py-0 sm:justify-center`}
    >
      {children}
    </ul>
  );
}
