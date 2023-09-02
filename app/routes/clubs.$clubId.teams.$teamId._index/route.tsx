import { useOutletContext } from 'react-router';
import React from 'react';
import type { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId/route';
import ResourceContextMenu, { EditLink } from '~/components/nav/resource-context-menu';
import { useParams } from '@remix-run/react';
import DeleteResourceModal from '~/components/delete/delete-resource-modal';

export default function Team() {
  const { team, teamRoles } = useOutletContext<TeamContextType>();
  const { clubId, teamId } = useParams();

  const contextMenu = (
    <ResourceContextMenu>
      <React.Fragment>
        <EditLink to={`/clubs/${clubId}/teams/${teamId}/edit`} />
        {teamRoles.isTeamLeader && (
          <DeleteResourceModal action={`/clubs/${clubId}/teams/${teamId}/delete`} message={'Are you sure you want to delete this team?'} />
        )}
      </React.Fragment>
    </ResourceContextMenu>
  );

  return (
    <main>
      {teamRoles.isTeamWebmaster && contextMenu}
      <div>{JSON.stringify(team, null, 2)}</div>
    </main>
  );
}
