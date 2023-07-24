import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { IoAppsOutline } from 'react-icons/io5';
import { FaRegNewspaper, FaUsers } from 'react-icons/fa';
import { RiTeamLine } from 'react-icons/ri';
import { GrOverview, GrSchedules } from 'react-icons/gr';
import UserCircle from '~/components/user/user-circle';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { findClubById } from '~/models/club.server';
import { useRef } from 'react';
import { requireClubUser } from '~/session.server';

export { ErrorBoundary } from '~/error-boundry';

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.clubId, 'clubId missing on route');
  const clubUserRoles = await requireClubUser(request, params.clubId);

  const club = await findClubById(params.clubId);
  if (!club) throw new Response('Club does not exist', { status: 404 });

  return json({ club, clubUserRoles });
};
export default function ClubLayout() {
  const divRef = useRef<HTMLDivElement>(null);
  const {
    club: { name, id },
    clubUserRoles
  } = useLoaderData<typeof loader>();

  function handleClick() {
    divRef.current?.classList.toggle(':dropdown-open');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  return (
    <div className="h-full">
      <div className={'navbar bg-base-300'}>
        <div className="flex-1">
          <Link to={`/clubs/${id}`} className="btn btn-ghost text-xl normal-case">
            {name}
          </Link>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end" ref={divRef}>
            <label tabIndex={0} className="btn btn-circle btn-ghost ">
              <div className="indicator">
                <IoAppsOutline size={30} />
              </div>
            </label>
            <div tabIndex={0} className="card dropdown-content card-compact z-[1] mt-3 w-64 bg-base-200 shadow sm:w-80 md:w-96">
              <div className="card-body">
                <Link to={`/clubs/${id}`} className="btn btn-ghost text-lg font-bold">
                  {name}
                </Link>

                <div className="card-actions gap-3">
                  <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
                    <Link to={`/clubs/${id}`} className="btn btn-accent" onClick={handleClick}>
                      <GrOverview />
                    </Link>
                    <div className={'text-center text-xs'}>Overview</div>
                  </div>
                  <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
                    <Link to={`/clubs/${id}/news`} className="btn btn-info" onClick={handleClick}>
                      <FaRegNewspaper />
                    </Link>
                    <div className={'text-center text-xs'}>News</div>
                  </div>
                  <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
                    <Link to={`/clubs/${id}/users`} className="btn btn-primary" onClick={handleClick}>
                      <FaUsers />
                    </Link>
                    <div className={'text-center text-xs'}>Members</div>
                  </div>
                  <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
                    <Link to={`/clubs/${id}/teams`} className="btn btn-secondary" onClick={handleClick}>
                      <RiTeamLine />
                    </Link>
                    <div className={'text-center text-xs'}>Teams</div>
                  </div>
                  <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
                    <Link to={`/clubs/${id}/schedules`} className="btn btn-accent" onClick={handleClick}>
                      <GrSchedules />
                    </Link>
                    <div className={'text-center text-xs'}>Schedule</div>
                  </div>
                </div>

                {clubUserRoles.isAdmin && (
                  <>
                    <div className="divider m-0 text-info">Admin</div>
                    <div className="card-actions">
                      <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
                        <Link to={`/clubs/${id}/admin/users`} className="btn btn-primary" onClick={handleClick}>
                          <FaUsers />
                        </Link>
                        <div className={'text-center text-xs'}>Members</div>
                      </div>
                    </div>
                  </>
                )}

                <div className="divider m-0 text-info">Personal</div>
                <div className="card-actions">
                  <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
                    <Link to={`/clubs/${id}/personal/teams`} className="btn btn-secondary" onClick={handleClick}>
                      <RiTeamLine />
                    </Link>
                    <div className={'text-center text-xs'}>My Teams</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <UserCircle />
        </div>
      </div>
      <div className={'container mx-auto p-2'}>
        <Outlet />
      </div>
    </div>
  );
}
