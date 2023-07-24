import { NavLink, Outlet, useParams } from '@remix-run/react';
import { AiOutlineHome } from 'react-icons/ai';
import { RiTeamLine } from 'react-icons/ri';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubAdmin } from '~/session.server';

export const loader = async ({ request, params }: LoaderArgs) => {
  const { clubId } = params;
  invariant(clubId, 'clubId not present in path');
  await requireClubAdmin(request, clubId);

  return json({});
};

export default function ClubAdminLayout() {
  return (
    <div>
      <AdminMenu />
      <Outlet />
    </div>
  );
}

function AdminMenu() {
  const { clubId } = useParams();

  return (
    <ul className="no-scrollbar menu rounded-box menu-horizontal menu-xs mb-2 w-full flex-nowrap gap-1 overflow-x-auto bg-base-200 sm:menu-md sm:justify-center">
      <li>
        <NavLink to={`/clubs/${clubId}/admin`} end>
          {({ isActive, isPending }) => (
            <div className={'flex flex-col items-center gap-0'}>
              <AiOutlineHome size={25} />
              <span className={`text-xs ${isActive ? 'active' : ''}`}>Home</span>
            </div>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink to={`/clubs/${clubId}/admin/teams`}>
          {({ isActive, isPending }) => (
            <div className={'flex flex-col items-center gap-0'}>
              <RiTeamLine size={25} />
              <span className={`text-xs ${isActive ? 'active' : ''}`}>Teams</span>
            </div>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink to={`/clubs/${clubId}/admin/users`}>
          {({ isActive, isPending }) => (
            <div className={'flex flex-col items-center gap-0'}>
              <RiTeamLine size={25} />
              <span className={`text-xs ${isActive ? 'active' : ''}`}>Members</span>
            </div>
          )}
        </NavLink>
      </li>
    </ul>
  );
}
