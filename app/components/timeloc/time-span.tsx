import { BiSolidTime } from 'react-icons/bi';
import { formatTime } from '~/date-utils';
import React from 'react';

type Props = { startTime: string; endTime: string };

export default function TimeSpan({ startTime, endTime }: Props) {
  return (
    <div className={'badge badge-sm flex'}>
      <BiSolidTime className={'mr-1'} />
      <div>{formatTime(startTime)}</div>
      <div>-</div>
      <div>{formatTime(endTime)}</div>
    </div>
  );
}
