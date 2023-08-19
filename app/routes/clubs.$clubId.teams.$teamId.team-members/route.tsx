import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';
import { getTeamUsersByTeamId } from '~/models/team.server';
import { useLoaderData, useParams } from '@remix-run/react';
import React from 'react';
import ResourceContextMenu, { EditLink } from '~/components/nav/resource-context-menu';
import AddMembersModal from '~/routes/clubs.$clubId.teams.$teamId.team-members/add-members-modal';
import DeleteResourceModal from '~/components/delete/delete-resource-modal';
import { useClubUserRoles } from '~/loader-utils';

export const loader = async ({ request, params: { clubId, teamId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');

  await requireClubUser(request, clubId);
  const teamUsers = await getTeamUsersByTeamId(teamId);

  return json({ teamUsers });
};

export default function TeamMembers() {
  const { teamUsers } = useLoaderData<typeof loader>();
  const { clubId, teamId } = useParams();
  const clubUserRoles = useClubUserRoles();

  const clubUserIds = React.useMemo(() => teamUsers.map(teamUser => teamUser.clubUser.id), [teamUsers]);

  const contextMenu = (
    <ResourceContextMenu backButton>
      {clubUserRoles.isAdmin && (
        <React.Fragment>
          <EditLink to={`/clubs/${clubId}/teams/${teamId}/edit`} />
          <AddMembersModal postAction={`/clubs/${clubId}/teams/${teamId}/add-team-members`} existingClubUserIds={clubUserIds} />
          <DeleteResourceModal action={`/clubs/${clubId}/teams/${teamId}/delete`} message={'Are you sure you want to delete this team?'} />
        </React.Fragment>
      )}
    </ResourceContextMenu>
  );

  return (
    <React.Fragment>
      {contextMenu}
      <main className={'py-4'}>
        <h1 className={'mb-4 text-center text-xl'}>Team Members</h1>
        {teamUsers.map(teamUser => (
          <div key={teamUser.id}>{JSON.stringify(teamUser, null, 2)}</div>
        ))}
      </main>
    </React.Fragment>
  );
}
