import { useLocation, useOutletContext } from 'react-router';
import ResourceContextMenu, { AddLink } from '~/components/nav/resource-context-menu';
import React from 'react';
import TrainingTimeIsland from '~/routes/clubs.$clubId.teams.$teamId._index/training-time-island';
import type { TeamActivityContext } from '~/routes/clubs.$clubId.teams.$teamId.activities/route';

export default function TeamActivities() {
  const { pathname } = useLocation();
  const { teamRoles, trainingTimes } = useOutletContext<TeamActivityContext>();

  const contextMenu = (
    <ResourceContextMenu>
      <AddLink to={`${pathname}/new`} />
    </ResourceContextMenu>
  );

  return (
    <main>
      {teamRoles.isTeamLeader && contextMenu}
      <TrainingTimeIsland trainingTimes={trainingTimes} />
    </main>
  );
}
