import { Outlet } from '@remix-run/react';
import { useOutletContext } from 'react-router';
import type { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId/route';

export default function TeamNewsLayout() {
  const teamRoles = useOutletContext<TeamContextType>();
  return <Outlet context={teamRoles} />;
}
