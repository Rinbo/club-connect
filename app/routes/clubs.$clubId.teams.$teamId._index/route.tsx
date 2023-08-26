import { useOutletContext } from 'react-router';
import React from 'react';
import type { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId/route';
import ResourceContextMenu, { EditLink } from '~/components/nav/resource-context-menu';
import { useClubUserRoles } from '~/loader-utils';
import { useParams } from '@remix-run/react';
import DeleteResourceModal from '~/components/delete/delete-resource-modal';

export default function Team() {
  const { team } = useOutletContext<TeamContextType>();
  const clubUserRoles = useClubUserRoles();
  const { clubId, teamId } = useParams();

  const contextMenu = (
    <ResourceContextMenu>
      <React.Fragment>
        <EditLink to={`/clubs/${clubId}/teams/${teamId}/edit`} />
        <DeleteResourceModal action={`/clubs/${clubId}/teams/${teamId}/delete`} message={'Are you sure you want to delete this team?'} />
      </React.Fragment>
    </ResourceContextMenu>
  );

  return (
    <main>
      {clubUserRoles.isAdmin && contextMenu}
      <div>{JSON.stringify(team, null, 2)}</div>
    </main>
  );
}
