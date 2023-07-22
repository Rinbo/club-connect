import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { IoAppsOutline } from 'react-icons/io5';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { findClubById } from '~/models/club.server';
import UserCircle from '~/components/user/user-circle';
import { FaRegNewspaper, FaUsers } from 'react-icons/fa';
import { RiTeamLine } from 'react-icons/ri';
import { GrSchedules } from 'react-icons/gr';

export { ErrorBoundary } from '~/error-boundry';

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.clubId, 'clubId missing on route');
  const club = await findClubById(params.clubId);

  // TODO need to get a new type for club user data which exposes boolean functions for the roles that the user has in this club

  if (!club) throw new Response('Club does not exist', { status: 404 });

  return json({ club });
};

export default function Clubs() {
  const {
    club: { name, id }
  } = useLoaderData<typeof loader>();

  return (
    <div className="h-full">
      <div className={'navbar bg-base-300'}>
        <div className="flex-1">
          <Link to={`/clubs/${id}`} className="btn btn-ghost text-xl normal-case">
            {name}
          </Link>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-circle btn-ghost ">
              <div className="indicator">
                <IoAppsOutline size={30} />
              </div>
            </label>
            <div tabIndex={0} className="card dropdown-content card-compact z-[1] mt-3 w-64 bg-base-200 shadow sm:w-80 md:w-96">
              <div className="card-body">
                <span className="text-lg font-bold">{name}</span>
                <div className="divider text-info">User Actions</div>
                <div className="card-actions">
                  <Link to={`/clubs/${id}/news`} className="btn btn-info">
                    <FaRegNewspaper />
                  </Link>
                  <Link to={`/clubs/${id}/users`} className="btn btn-primary">
                    <FaUsers />
                  </Link>
                  <Link to={`/clubs/${id}/teams`} className="btn btn-secondary">
                    <RiTeamLine />
                  </Link>
                  <Link to={`/clubs/${id}/schedules`} className="btn btn-accent">
                    <GrSchedules />
                  </Link>
                </div>
                <div className="divider text-info">Admin</div>
                <div className="card-actions">
                  <Link to={`/clubs/${id}/admin/users`} className="btn btn-primary">
                    <FaUsers />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <UserCircle />
        </div>
      </div>
      <Outlet />
    </div>
  );
}
