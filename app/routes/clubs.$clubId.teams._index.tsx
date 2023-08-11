import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useClubUserRoles } from '~/loader-utils';
import ResourceContextMenu, { AddLink } from '~/components/nav/resource-context-menu';
import { useLoaderData, useParams } from '@remix-run/react';
import { findTeamsByClubId } from '~/models/team.server';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';

export const loader = async ({ request, params: { clubId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing in route');
  await requireClubUser(request, clubId);

  const teams = await findTeamsByClubId(clubId, 0, 20);
  return json({ teams });
};

export default function Teams() {
  const clubUserRoles = useClubUserRoles();
  const { teams } = useLoaderData<typeof loader>();
  const { clubId } = useParams();

  const contextMenu = clubUserRoles.isAdmin && (
    <ResourceContextMenu>
      <AddLink to={`/clubs/${clubId}/teams/new`} />
      <section>
        {teams.map(team => (
          <div key={team.id}>{JSON.stringify(team, null, 2)}</div>
        ))}
      </section>
    </ResourceContextMenu>
  );

  return <main>{contextMenu}</main>;
}
