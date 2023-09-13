import { Outlet } from '@remix-run/react';
import { useOutletContext } from 'react-router';
import type { ClientTrainingTime, TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId/route';
import type { TeamUserRoles } from '~/session.server';

export type TeamActivityContext = { teamRoles: TeamUserRoles; trainingTimes: ClientTrainingTime[] };

export default function TeamActivitiesLayout() {
  const { teamRoles, trainingTimes } = useOutletContext<TeamContextType>();

  return <Outlet context={{ teamRoles, trainingTimes } satisfies TeamActivityContext} />;
}
