import { Link, Outlet } from '@remix-run/react';
import { IoAppsOutline } from 'react-icons/io5';
import UserCircle from '~/components/user/user-circle';
import { useRef } from 'react';
import { LuLayoutDashboard } from 'react-icons/lu';

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
            Club Connect
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
                <span className="text-lg font-bold">Navigation</span>
                <div className="card-actions">
                  <div className={'btn-ghost flex flex-col items-center gap-1 rounded p-1'}>
                    <Link to={`/dashboard`} className="btn btn-accent" onClick={handleClick}>
                      <LuLayoutDashboard />
                    </Link>
                    <div className={'text-center text-xs'}>Members</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <UserCircle />
        </div>
      </div>
      <div className={'p-2'}>
        <Outlet />
      </div>
    </div>
  );
}
