import React from 'react';
import { getColorForString, getStringInitials } from '~/utils';

type ClubProps = {
  name: string;
  logoUrl?: string;
};

const ClubCard: React.FC<ClubProps> = ({ name, logoUrl }) => {
  const displayLogo = logoUrl || getStringInitials(name);
  const bgColor = logoUrl ? 'transparent' : getColorForString(name);

  return (
    <div className="flex w-64 items-center gap-2 rounded-xl border p-2 shadow">
      <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: bgColor }}>
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="h-full w-full rounded-full" />
        ) : (
          <div className="p-4 text-xl font-bold">{displayLogo}</div>
        )}
      </div>
      <h3 className="grow text-center text-lg">{name}</h3>
    </div>
  );
};

export default ClubCard;
