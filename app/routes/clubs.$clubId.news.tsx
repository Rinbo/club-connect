import { Outlet } from '@remix-run/react';

export default function ClubNewsLayout() {
  return (
    <div className={'container mx-auto'}>
      <Outlet />
    </div>
  );
}
