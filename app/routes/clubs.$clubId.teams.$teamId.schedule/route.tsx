import { useLoaderData, useParams } from '@remix-run/react';
import { useOutletContext } from 'react-router';
import type { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId/route';
import ResourceContextMenu, { AddLink } from '~/components/nav/resource-context-menu';
import React from 'react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';
import { findTrainingTimesByTeamId } from '~/models/training-time.server';
import type { TrainingTime as DbTrainingTime } from '@prisma/client';
import TrainingTimeIsland from '~/routes/clubs.$clubId.teams.$teamId.schedule/training-time-island';

export type TrainingTime = Omit<DbTrainingTime, 'createdAt' | 'updatedAt'>;
type LoaderData = { trainingTimes: TrainingTime[] };

export const loader = async ({ request, params: { clubId, teamId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing from route');
  invariant(teamId, 'teamId missing from route');
  await requireClubUser(request, clubId);

  const trainingTimes = await findTrainingTimesByTeamId(teamId);

  return json({ trainingTimes });
};

export default function TeamSchedule() {
  const { clubId, teamId } = useParams();
  const { teamRoles } = useOutletContext<TeamContextType>();
  const { trainingTimes } = useLoaderData<LoaderData>();

  const contextMenu = (
    <ResourceContextMenu>
      <AddLink to={`/clubs/${clubId}/teams/${teamId}/news/new`} />
    </ResourceContextMenu>
  );

  return (
    <main>
      {teamRoles.isTeamLeader && contextMenu}
      <section>
        <TrainingTimeIsland trainingTimes={trainingTimes} />
      </section>
    </main>
  );
}
