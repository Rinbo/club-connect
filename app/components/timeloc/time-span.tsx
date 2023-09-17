import { BiSolidTime } from 'react-icons/bi';
import { formatTime } from '~/date-utils';
import type { HTMLAttributes } from 'react';
import React from 'react';
import { cn } from '~/misc-utils';

interface ChildComponentProps extends HTMLAttributes<HTMLDivElement> {
  startTime: string;
  endTime: string;
}

export default function TimeSpan({ startTime, endTime, className }: ChildComponentProps) {
  return (
    <div className={cn('badge badge-sm flex', className)}>
      <BiSolidTime className={'mr-1'} />
      <div>{formatTime(startTime)}</div>
      <div>-</div>
      <div>{formatTime(endTime)}</div>
    </div>
  );
}
