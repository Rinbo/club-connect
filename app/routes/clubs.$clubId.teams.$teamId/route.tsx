import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import type { TeamUserRoles } from '~/session.server';
import { getTeamRoles, requireClubUser } from '~/session.server';
import { getTeamById } from '~/models/team.server';
import type { Team } from '.prisma/client';
import { findTrainingTimesByTeamId } from '~/models/training-time.server';
import type { TeamNews, TrainingTime } from '@prisma/client';
import { findClubNews } from '~/models/team-news.server';
import type { Clientify } from '~/misc-utils';

export { ErrorBoundary } from '~/error-boundry';

export type ClientTrainingTime = Clientify<TrainingTime>;
export type ClientTeamNews = Clientify<TeamNews> & { imageUrls: { url: string }[] };
export type ClientTeam = Clientify<Team>;

export type TeamContext = {
  team: ClientTeam;
  teamRoles: TeamUserRoles;
  trainingTimes: ClientTrainingTime[];
  teamNews: ClientTeamNews[];
};

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
  const teamNews = await findClubNews(clubId, teamId, 0, 5);

  return json({ team, teamRoles, trainingTimes, teamNews });
};

export default function TeamLayout() {
  const { team, teamRoles, trainingTimes, teamNews } = useLoaderData<typeof loader>();
  return <Outlet context={{ team, teamRoles, trainingTimes, teamNews } satisfies TeamContext} />;
}
