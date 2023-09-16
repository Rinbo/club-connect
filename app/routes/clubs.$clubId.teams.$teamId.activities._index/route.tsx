import { useLocation, useOutletContext } from 'react-router';
import ResourceContextMenu, { AddLink } from '~/components/nav/resource-context-menu';
import React from 'react';
import TrainingTimeIsland from '~/routes/clubs.$clubId.teams.$teamId._index/training-time-island';
import type { TeamActivityContext } from '~/routes/clubs.$clubId.teams.$teamId.activities/route';

export default function TeamActivities() {
  const { pathname } = useLocation();
  const { teamRoles, trainingTimes, teamActivities } = useOutletContext<TeamActivityContext>();

  const contextMenu = (
    <ResourceContextMenu>
      <AddLink to={`${pathname}/new`} />
    </ResourceContextMenu>
  );

  return (
    <main>
      {teamRoles.isTeamLeader && contextMenu}
      <TrainingTimeIsland trainingTimes={trainingTimes} />
      <section className={'mt-2 flex flex-wrap gap-3'}>
        {teamActivities.map(teamActivity => (
          <pre key={teamActivity.id} className={'max-w-md rounded-xl border p-2'}>
            {JSON.stringify(teamActivity, null, 2)}
          </pre>
        ))}
      </section>
    </main>
  );
}
