import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';
import { getTeamById } from '~/models/team.server';
import type { Team } from '.prisma/client';

export { ErrorBoundary } from '~/error-boundry';

type ClientTeam = Omit<Team, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export type TeamContextType = { team: ClientTeam | null };

export const loader = async ({ request, params: { clubId, teamId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');
  await requireClubUser(request, clubId);

  const team = await getTeamById(teamId);

  return json({ team });
};

export default function TeamLayout() {
  const { team } = useLoaderData<typeof loader>();
  return <Outlet context={{ team } satisfies TeamContextType} />;
}
