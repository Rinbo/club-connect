import { Outlet, useLoaderData } from '@remix-run/react';
import { useOutletContext } from 'react-router';
import type { ClientTrainingTime, TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId/route';
import type { TeamUserRoles } from '~/session.server';
import { requireClubUser } from '~/session.server';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { findTeamActivities } from '~/models/team-activity.server';
import type { TeamActivity } from '@prisma/client';

export type ClientTeamActivity = Omit<TeamActivity, 'startTime' | 'endTime' | 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
  startTime: string;
  endTime: string;
};

export type TeamActivitiesContext = { teamRoles: TeamUserRoles; trainingTimes: ClientTrainingTime[]; teamActivities: ClientTeamActivity[] };

export const loader = async ({ request, params: { clubId, teamId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');

  await requireClubUser(request, clubId);
  const teamActivities = await findTeamActivities(teamId, 0, 10);

  return json({ teamActivities });
};

export default function TeamActivitiesLayout() {
  const { teamActivities } = useLoaderData<{ teamActivities: ClientTeamActivity[] }>();
  const { teamRoles, trainingTimes } = useOutletContext<TeamContextType>();

  return <Outlet context={{ teamRoles, trainingTimes, teamActivities } satisfies TeamActivitiesContext} />;
}
