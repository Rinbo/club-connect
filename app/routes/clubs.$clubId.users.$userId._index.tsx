import { useClubUser } from '~/loader-utils';
import UserDisplay from '~/components/user/user-display';
import { AiOutlinePhone } from 'react-icons/ai';
import { FaRegAddressCard } from 'react-icons/fa';
import { Link } from '@remix-run/react';
import React from 'react';

export default function ClubUser() {
  const clubUser = useClubUser();

  return (
    <UserDisplay user={clubUser.user}>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <AiOutlinePhone size={30} />
          <span className="text-lg">+46 555 555 55</span>
        </div>
        <div className="flex items-center gap-4">
          <FaRegAddressCard size={30} />
          <span className="text-lg">
            Generic Street 17
            <br />
            City
          </span>
        </div>
      </div>
      <div className={'flex flex-row flex-wrap gap-2'}>
        {clubUser.clubRoles.map(clubRole => (
          <span key={clubRole} className={'badge badge-neutral'}>
            {clubRole}
          </span>
        ))}
      </div>
      <Link to={`mailto:${clubUser.user.email}`} className="btn btn-accent mt-4">
        Contact
      </Link>
    </UserDisplay>
  );
}
