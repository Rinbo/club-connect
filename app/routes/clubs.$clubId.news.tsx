import { Outlet } from '@remix-run/react';

// TODO move context menu to here instead?
export default function ClubNewsLayout() {
  return (
    <div className={'container mx-auto'}>
      <Outlet />
    </div>
  );
}
