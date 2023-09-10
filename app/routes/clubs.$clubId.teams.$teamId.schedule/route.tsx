import { useParams } from '@remix-run/react';
import { useOutletContext } from 'react-router';
import type { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId/route';
import ResourceContextMenu, { AddLink } from '~/components/nav/resource-context-menu';
import React from 'react';
import TrainingTimeIsland from '~/routes/clubs.$clubId.teams.$teamId.schedule/training-time-island';

export default function TeamSchedule() {
  const { clubId, teamId } = useParams();
  const { teamRoles, trainingTimes } = useOutletContext<TeamContextType>();

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
