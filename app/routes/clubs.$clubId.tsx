import { Link, NavLink, Outlet, useLoaderData, useMatches, useParams } from '@remix-run/react';
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
import { getGravatarUrl } from '~/misc-utils';

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
  const matches = useMatches();

  const teamRoute = React.useMemo(() => {
    return matches.find(route => route.handle && route.handle.isTeamRoute);
  }, [matches]);

  function handleClick() {
    divRef.current?.classList.toggle(':dropdown-open');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  return (
    <nav className="h-full">
      <div className={'navbar bg-base-300'}>
        <div className="flex-1">
          {teamRoute ? (
            <Link to={teamRoute.pathname} className="text-md btn btn-ghost normal-case xs:text-xl">
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                src={teamRoute.data.team.logoUrl ? teamRoute.data.team.logoUrl : getGravatarUrl(teamRoute.data.team.name)}
                alt={name}
              />
              {teamRoute.data.team.name}
            </Link>
          ) : (
            <Link to={`/clubs/${id}`} className="text-md btn btn-ghost normal-case xs:text-xl">
              {logoUrl && <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={logoUrl} alt={name} />}
              {name}
            </Link>
          )}
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end" ref={divRef}>
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
                  <MenuLink to={`/clubs/${id}`} icon={<FaHome />} label={'Home'} color="btn-accent" onClick={handleClick} />
                  <MenuLink to={`/clubs/${id}`} icon={<FaRegNewspaper />} label={'News'} color="btn-info" onClick={handleClick} />
                  <MenuLink to={`/clubs/${id}/users`} icon={<FaUsers />} label={'Members'} color="btn-primary" onClick={handleClick} />
                  <MenuLink to={`/clubs/${id}/teams`} icon={<RiTeamLine />} label={'Teams'} color={'btn-secondary'} onClick={handleClick} />
                  <MenuLink
                    to={`/clubs/${id}/schedules`}
                    icon={<AiOutlineSchedule />}
                    label={'Schedule'}
                    color="btn-accent"
                    onClick={handleClick}
                  />
                </div>

                {clubUserRoles.isAdmin && (
                  <>
                    <div className="divider m-0 text-info">Admin</div>
                    <div className="card-actions gap-2">
                      <MenuLink to={`/clubs/${id}/settings`} icon={<FiSettings />} label={'Settings'} onClick={handleClick} />
                    </div>
                  </>
                )}

                <div className="divider m-0 text-info">Personal</div>
                <div className="card-actions gap-2">
                  <MenuLink to={'/dashboard'} icon={<LuLayoutDashboard />} label={'Dashboard'} color="btn-accent" onClick={handleClick} />
                  <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1 pl-0'}>
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
      <div className={'container mx-auto px-2 py-2 xs:px-0'}>
        {teamRoute ? <TeamMenu teamRoot={teamRoute.pathname} /> : <ClubMenu />}
        <Outlet />
      </div>
    </nav>
  );
}

function ClubMenu() {
  const { clubId } = useParams();

  return (
    <nav>
      <ul className="menu-animate-right no-scrollbar menu rounded-box menu-horizontal menu-xs z-10 mb-1 w-full flex-nowrap gap-1 overflow-x-auto bg-base-200 sm:menu-md sm:justify-center">
        <MenuNavLink to={`/clubs/${clubId}`} icon={<FaHome />} label={'Home'} />
        <MenuNavLink to={`/clubs/${clubId}/news`} icon={<FaRegNewspaper />} label={'News'} />
        <MenuNavLink to={`/clubs/${clubId}/users`} icon={<FaUsers />} label={'Members'} />
        <MenuNavLink to={`/clubs/${clubId}/teams`} icon={<RiTeamLine />} label={'Teams'} />
        <MenuNavLink to={`/clubs/${clubId}/schedules`} icon={<AiOutlineSchedule />} label={'Schedules'} />
      </ul>
    </nav>
  );
}

function TeamMenu({ teamRoot }: { teamRoot: string }) {
  return (
    <nav>
      <ul className="menu-animate-right no-scrollbar menu rounded-box menu-horizontal menu-xs z-10 mb-1 w-full flex-nowrap gap-1 overflow-x-auto bg-base-200 sm:menu-md sm:justify-center">
        <MenuNavLink to={`${teamRoot}`} icon={<FaHome />} label={'Home'} />
        <MenuNavLink to={`${teamRoot}/news`} icon={<FaRegNewspaper />} label={'News'} />
        <MenuNavLink to={`${teamRoot}/team-members`} icon={<RiTeamLine />} label={'Members'} />
        <MenuNavLink to={`${teamRoot}/schedule`} icon={<AiOutlineSchedule />} label={'Schedule'} />
      </ul>
    </nav>
  );
}

function MenuNavLink({ to, icon, label }: { to: string; icon: React.ReactElement; label: string }) {
  return (
    <li>
      <NavLink to={to} end>
        {({ isActive, isPending }) => (
          <div className={'flex flex-col items-center gap-0'}>
            {React.cloneElement(icon, { size: ICON_SIZE })}
            <span className={`text-xs ${isActive ? 'active' : ''}`}>{label}</span>
          </div>
        )}
      </NavLink>
    </li>
  );
}

function MenuLink({
  to,
  icon,
  label,
  color = 'btn-primary',
  onClick
}: {
  to: string;
  icon: React.ReactElement;
  label: string;
  color?: string;
  onClick: () => void;
}) {
  return (
    <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
      <Link to={to} className={`btn ${color}`} onClick={onClick}>
        {icon}
      </Link>
      <div className={'text-center text-xs'}>{label}</div>
    </div>
  );
}
