import { Link, Outlet } from '@remix-run/react';
import { IoAppsOutline } from 'react-icons/io5';
import UserCircle from '~/components/user/user-circle';
import { useRef } from 'react';
import { LuLayoutDashboard } from 'react-icons/lu';
import { MdOutlineJoinInner } from 'react-icons/md';
import AppLogo from '~/components/logo';
import { json, LoaderArgs } from '@remix-run/node';
import { requireUserId } from '~/session.server';
import { findAllClubsByUserId } from '~/models/club.server';

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const clubs = await findAllClubsByUserId(userId);
  return json({ clubs });
};

export default function Dashboard() {
  const divRef = useRef<HTMLDivElement>(null);
  function handleClick() {
    divRef.current?.classList.toggle(':dropdown-open');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
  return (
    <div className={'h-full'}>
      <div className={'navbar bg-base-300'}>
        <div className="flex-1">
          <Link to={'/dashboard'} className="btn btn-ghost text-xl normal-case">
            <div className={'flex items-center justify-center'}>
              <AppLogo className={'h-6 w-6 fill-primary xs:h-8 xs:w-8'} />
              <div className={'ml-2 font-mono text-lg text-base-content xs:text-2xl'}>Club Connect</div>
            </div>
          </Link>
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
                <Link to={'/dashboard'} className="btn btn-ghost text-xl normal-case">
                  <div className={'flex items-center justify-center'}>
                    <AppLogo className={'h-8 w-8 fill-primary'} />
                    <div className={'ml-2 font-mono text-xl text-base-content'}>Club Connect</div>
                  </div>
                </Link>
                <div className="card-actions">
                  <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
                    <Link to={`/dashboard`} className="btn btn-accent" onClick={handleClick}>
                      <LuLayoutDashboard />
                    </Link>
                    <div className={'text-center text-xs'}>Dashboard</div>
                  </div>

                  <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
                    <Link to={`/dashboard/join-club`} className="btn btn-secondary" onClick={handleClick}>
                      <MdOutlineJoinInner />
                    </Link>
                    <div className={'text-center text-xs'}>Join</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <UserCircle />
        </div>
      </div>
      <div className={'container mx-auto py-2'}>
        <Outlet />
      </div>
    </div>
  );
}
