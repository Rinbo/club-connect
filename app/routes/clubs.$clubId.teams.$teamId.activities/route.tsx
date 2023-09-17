import { Link, useLoaderData } from '@remix-run/react';
import { useLocation, useOutletContext } from 'react-router';
import type { TeamContext } from '~/routes/clubs.$clubId.teams.$teamId/route';
import { requireClubUser } from '~/session.server';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { findTeamActivities } from '~/models/team-activity.server';
import type { TeamActivity } from '@prisma/client';
import ResourceContextMenu, { AddLink } from '~/components/nav/resource-context-menu';
import TrainingTimeIsland from '~/routes/clubs.$clubId.teams.$teamId._index/training-time-island';
import React from 'react';

export type ClientTeamActivity = Omit<TeamActivity, 'startTime' | 'endTime' | 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
  startTime: string;
  endTime: string;
};

type LoaderData = { teamActivities: ClientTeamActivity[] };

export const loader = async ({ request, params: { clubId, teamId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');

  await requireClubUser(request, clubId);
  const teamActivities = await findTeamActivities(teamId, 0, 10);

  return json({ teamActivities });
};

export default function TeamActivitiesLayout() {
  const { pathname } = useLocation();
  const { teamActivities } = useLoaderData<LoaderData>();
  const { teamRoles, trainingTimes } = useOutletContext<TeamContext>();

  const contextMenu = (
    <ResourceContextMenu>
      <AddLink to={`${pathname}/new`} />
    </ResourceContextMenu>
  );

  return (
    <main>
      {teamRoles.isTeamWebmaster && contextMenu}
      <TrainingTimeIsland trainingTimes={trainingTimes} />
      <section className={'mt-2 flex flex-wrap gap-3'}>
        {teamActivities.map(teamActivity => (
          <pre key={teamActivity.id} className={'max-w-md overflow-hidden rounded-xl border p-2'}>
            <Link to={pathname + '/' + teamActivity.id}>{JSON.stringify(teamActivity, null, 2)}</Link>
          </pre>
        ))}
      </section>
    </main>
  );
}
