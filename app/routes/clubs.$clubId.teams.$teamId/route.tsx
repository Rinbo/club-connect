import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import type { TeamUserRoles } from '~/session.server';
import { getTeamRoles, requireClubUser } from '~/session.server';
import { getTeamById } from '~/models/team.server';
import type { Team } from '.prisma/client';
import { findTrainingTimesByTeamId } from '~/models/training-time.server';
import type { TrainingTime as DbTrainingTime } from '@prisma/client';

export { ErrorBoundary } from '~/error-boundry';

export type TrainingTime = Omit<DbTrainingTime, 'createdAt' | 'updatedAt'>;
export type ClientTeam = Omit<Team, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export type TeamContextType = { team: ClientTeam | null; teamRoles: TeamUserRoles; trainingTimes: TrainingTime[] };

export const handle = {
  isTeamRoute: true
};

export const loader = async ({ request, params: { clubId, teamId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');
  await requireClubUser(request, clubId);

  const team = await getTeamById(teamId);
  const teamRoles: TeamUserRoles = await getTeamRoles(request, clubId, teamId);
  const trainingTimes = await findTrainingTimesByTeamId(teamId);

  return json({ team, teamRoles, trainingTimes });
};

export default function TeamLayout() {
  const { team, teamRoles, trainingTimes } = useLoaderData<typeof loader>();
  return <Outlet context={{ team, teamRoles, trainingTimes } satisfies TeamContextType} />;
}
