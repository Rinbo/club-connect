import { Link, NavLink, Outlet, useLoaderData, useParams } from '@remix-run/react';
import { IoAppsOutline } from 'react-icons/io5';
import { FaHome, FaRegNewspaper, FaUsers } from 'react-icons/fa';
import { RiTeamLine } from 'react-icons/ri';
import UserCircle from '~/components/user/user-circle';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { findClubById } from '~/models/club.server';
import React, { useRef } from 'react';
import { requireClubUser } from '~/session.server';
import { AiOutlineSchedule } from 'react-icons/ai';
import { LuLayoutDashboard } from 'react-icons/lu';
import { FiSettings } from 'react-icons/fi';

export { ErrorBoundary } from '~/error-boundry';

const ICON_SIZE = 25;

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.clubId, 'clubId missing on route');
  const clubUserRoles = await requireClubUser(request, params.clubId);

  const club = await findClubById(params.clubId);
  if (!club) throw new Response('Club does not exist', { status: 404 });

  return json({ club, clubUserRoles });
};

export default function ClubLayout() {
  const {
    club: { id, name, logoUrl },
    clubUserRoles
  } = useLoaderData<typeof loader>();
  const divRef = useRef<HTMLDivElement>(null);

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
          <Link to={`/clubs/${id}`} className="text-md btn btn-ghost normal-case xs:text-xl">
            {logoUrl && <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={logoUrl} alt={name} />}
            {name}
          </Link>
        </div>
        <div className="flex-none">
          <div className="dropdown-end dropdown" ref={divRef}>
            <label tabIndex={0} className="btn btn-circle btn-ghost ">
              <div className="indicator">
                <IoAppsOutline size={30} />
              </div>
            </label>
            <div tabIndex={0} className="card dropdown-content card-compact z-20 mt-3 w-64 bg-base-200 shadow sm:w-80 md:w-96">
              <div className="card-body">
                <Link to={`/clubs/${id}`} className="btn btn-ghost text-lg font-bold">
                  {name}
                </Link>

                <div className="card-actions gap-2">
                  <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
                    <Link to={`/clubs/${id}`} className="btn btn-accent" onClick={handleClick}>
                      <FaHome />
                    </Link>
                    <div className={'text-center text-xs'}>Home</div>
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
                      <AiOutlineSchedule />
                    </Link>
                    <div className={'text-center text-xs'}>Schedule</div>
                  </div>
                </div>

                {clubUserRoles.isAdmin && (
                  <>
                    <div className="divider m-0 text-info">Admin</div>
                    <div className="card-actions gap-2">
                      <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
                        <Link to={`/clubs/${id}/settings`} className="btn btn-primary" onClick={handleClick}>
                          <FiSettings />
                        </Link>
                        <div className={'text-center text-xs'}>Settings</div>
                      </div>
                    </div>
                  </>
                )}

                <div className="divider m-0 text-info">Personal</div>
                <div className="card-actions gap-2">
                  <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1 pl-0'}>
                    <Link to={'/dashboard'} className="btn btn-accent" onClick={handleClick}>
                      <LuLayoutDashboard />
                    </Link>
                    <div className={'text-center text-xs'}>Dashboard</div>
                  </div>
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
      <div className={'container mx-auto py-2'}>
        <ClubMenu />
        <div className={'px-2 xs:px-0'}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function ClubMenu() {
  const { clubId } = useParams();

  return (
    <ul className="menu-animate-right no-scrollbar menu rounded-box menu-horizontal menu-xs z-10 mb-1 w-full flex-nowrap gap-1 overflow-x-auto bg-base-200 sm:menu-md sm:justify-center">
      <li>
        <NavLink to={`/clubs/${clubId}`} end>
          {({ isActive, isPending }) => (
            <div className={'flex flex-col items-center gap-0'}>
              <FaHome size={ICON_SIZE} />
              <span className={`text-xs ${isActive ? 'active' : ''}`}>Home</span>
            </div>
          )}
        </NavLink>
      </li>

      <li>
        <NavLink to={`/clubs/${clubId}/news`} end>
          {({ isActive, isPending }) => (
            <div className={'flex flex-col items-center gap-0'}>
              <FaRegNewspaper size={ICON_SIZE} />
              <span className={`text-xs ${isActive ? 'active' : ''}`}>News</span>
            </div>
          )}
        </NavLink>
      </li>

      <li>
        <NavLink to={`/clubs/${clubId}/users`}>
          {({ isActive, isPending }) => (
            <div className={'flex flex-col items-center gap-0'}>
              <FaUsers size={ICON_SIZE} />
              <span className={`text-xs ${isActive ? 'active' : ''}`}>Members</span>
            </div>
          )}
        </NavLink>
      </li>

      <li>
        <NavLink to={`/clubs/${clubId}/teams`}>
          {({ isActive, isPending }) => (
            <div className={'flex flex-col items-center gap-0'}>
              <RiTeamLine size={ICON_SIZE} />
              <span className={`text-xs ${isActive ? 'active' : ''}`}>Teams</span>
            </div>
          )}
        </NavLink>
      </li>

      <li>
        <NavLink to={`/clubs/${clubId}/schedules`} end>
          {({ isActive, isPending }) => (
            <div className={'flex flex-col items-center gap-0'}>
              <AiOutlineSchedule size={ICON_SIZE} />
              <span className={`text-xs ${isActive ? 'active' : ''}`}>Schedules</span>
            </div>
          )}
        </NavLink>
      </li>
    </ul>
  );
}
