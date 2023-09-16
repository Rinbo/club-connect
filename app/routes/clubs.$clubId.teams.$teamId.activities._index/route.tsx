import { useLocation, useOutletContext } from 'react-router';
import ResourceContextMenu, { AddLink } from '~/components/nav/resource-context-menu';
import React from 'react';
import TrainingTimeIsland from '~/routes/clubs.$clubId.teams.$teamId._index/training-time-island';
import type { TeamActivitiesContext } from '~/routes/clubs.$clubId.teams.$teamId.activities/route';
import { Link } from '@remix-run/react';

export default function TeamActivities() {
  const { pathname } = useLocation();
  const { teamRoles, trainingTimes, teamActivities } = useOutletContext<TeamActivitiesContext>();

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
          <pre key={teamActivity.id} className={'max-w-md rounded-xl border p-2'}>
            <Link to={pathname + '/' + teamActivity.id}>{JSON.stringify(teamActivity, null, 2)}</Link>
          </pre>
        ))}
      </section>
    </main>
  );
}
