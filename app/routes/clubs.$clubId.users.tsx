import { Outlet } from '@remix-run/react';

export default function ClubUsersLayout() {
  return (
    <div className={'container mx-auto py-2'}>
      <Outlet />
    </div>
  );
}
