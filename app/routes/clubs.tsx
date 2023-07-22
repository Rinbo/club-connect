import { Outlet } from '@remix-run/react';
import LogoutButton from '~/components/misc/logout-button';

export default function Clubs() {
  return (
    <div className="h-full">
      <div className={'flex items-center justify-between bg-indigo-600 p-2'}>
        <div className={'text-lg text-slate-300'}>Clubs nav</div>
        <LogoutButton />
      </div>
      <Outlet />
    </div>
  );
}
