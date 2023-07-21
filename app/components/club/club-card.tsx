import React from 'react';
import { getColorForString, getStringInitials } from '~/utils';
import { Link } from '@remix-run/react';

type ClubProps = {
  name: string;
  logoUrl?: string;
};

const ClubCard: React.FC<ClubProps> = ({ name, logoUrl }) => {
  const displayLogo = logoUrl || getStringInitials(name);
  const bgColor = logoUrl ? 'transparent' : getColorForString(name);

  return (
    <Link to={'/'} className="flex w-64 items-center gap-2 rounded-xl border p-2 shadow duration-200 hover:scale-105">
      <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: bgColor }}>
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="h-full w-full rounded-full" />
        ) : (
          <div className="p-4 text-xl font-bold text-white">{displayLogo}</div>
        )}
      </div>
      <h3 className="grow text-center">{name}</h3>
    </Link>
  );
};

export default ClubCard;
