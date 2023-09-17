import { FaLocationDot } from 'react-icons/fa6';
import React from 'react';

type Props = { location: string };

export default function LocationBadge({ location }: Props) {
  return (
    <div className={'badge badge-sm flex gap-1'}>
      <FaLocationDot />
      {location}
    </div>
  );
}
