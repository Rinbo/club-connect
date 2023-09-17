import { FaLocationDot } from 'react-icons/fa6';
import type { HTMLAttributes } from 'react';
import React from 'react';
import { cn } from '~/misc-utils';

interface ChildComponentProps extends HTMLAttributes<HTMLDivElement> {
  location: string;
}

export default function LocationBadge({ location, className }: ChildComponentProps) {
  return (
    <div className={cn('badge badge-sm flex gap-1', className)}>
      <FaLocationDot />
      {location}
    </div>
  );
}
