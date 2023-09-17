import { useLocation, useOutletContext } from 'react-router';
import ResourceContextMenu, { EditLink } from '~/components/nav/resource-context-menu';
import React from 'react';
import DeleteResourceModal from '~/components/delete/delete-resource-modal';
import type { TeamActivityContext } from '~/routes/clubs.$clubId.teams.$teamId.activities.$activityId/route';

export default function TeamActivity() {
  const { teamRoles, teamActivity } = useOutletContext<TeamActivityContext>();
  const { pathname } = useLocation();

  const contextMenu = (
    <ResourceContextMenu backButton>
      <React.Fragment>
        <EditLink to={`${pathname}/edit`} />
        <DeleteResourceModal action={`${pathname}/delete`} message={'Are you sure you want to delete this activity?'} />
      </React.Fragment>
    </ResourceContextMenu>
  );

  return (
    <main>
      {teamRoles.isTeamWebmaster && contextMenu}
      <section>
        <pre>{teamActivity && JSON.stringify(teamActivity, null, 2)}</pre>
      </section>
    </main>
  );
}
