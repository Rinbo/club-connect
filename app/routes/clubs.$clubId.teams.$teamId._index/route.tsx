import { useOutletContext } from 'react-router';
import React from 'react';
import type { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId/route';
import ResourceContextMenu, { EditLink } from '~/components/nav/resource-context-menu';
import { useParams } from '@remix-run/react';
import DeleteResourceModal from '~/components/delete/delete-resource-modal';
import TrainingTimeIsland from '~/routes/clubs.$clubId.teams.$teamId.schedule/training-time-island';

export default function Team() {
  const { teamRoles, trainingTimes } = useOutletContext<TeamContextType>();
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
      <TrainingTimeIsland trainingTimes={trainingTimes} />
    </main>
  );
}
