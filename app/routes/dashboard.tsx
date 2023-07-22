import { Link, Outlet } from '@remix-run/react';
import { IoAppsOutline } from 'react-icons/io5';
import UserCircle from '~/components/user/user-circle';

export default function Dashboard() {
  return (
    <div className={'h-full'}>
      <div className={'navbar bg-base-300'}>
        <div className="flex-1">
          <Link to={'/dashboard'} className="btn btn-ghost text-xl normal-case">
            Club Connect
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
                <span className="text-lg font-bold">Navigation</span>
                <span className="text-info">Admin</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">Manage users</button>
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
