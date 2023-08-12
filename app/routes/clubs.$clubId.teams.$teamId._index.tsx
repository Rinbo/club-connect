import { useOutletContext } from 'react-router';
import type { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId';
import ResourceContextMenu, { EditLink } from '~/components/nav/resource-context-menu';
import { useClubUserRoles } from '~/loader-utils';
import { useParams } from '@remix-run/react';

export default function Team() {
  const { team } = useOutletContext<TeamContextType>();
  const { clubId, teamId } = useParams();
  const clubUserRoles = useClubUserRoles();

  const contextMenu = (
    <ResourceContextMenu backButton>
      {clubUserRoles.isAdmin && <EditLink to={`/clubs/${clubId}/teams/${teamId}/edit`} />}
    </ResourceContextMenu>
  );

  return (
    <section>
      {contextMenu}
      <div>{JSON.stringify(team, null, 2)}</div>
    </section>
  );
}
