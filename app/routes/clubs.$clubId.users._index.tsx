import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';
import { findClubUsersByClubId } from '~/models/club-user.server';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { AiOutlineMail } from 'react-icons/ai';
import { useClubUserRoles } from '~/loader-utils';
import ResourceContextMenu from '~/components/nav/resource-context-menu';

export { ErrorBoundary } from '~/error-boundry';

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.clubId, 'clubId not present in route');
  await requireClubUser(request, params.clubId);
  const clubUsers = await findClubUsersByClubId(params.clubId);
  return json({ clubUsers });
};

export default function ClubUsers() {
  const { clubUsers } = useLoaderData<typeof loader>();
  const clubUserRoles = useClubUserRoles();

  return (
    <div>
      {clubUserRoles.isAdmin && <AdminUsersMenu />}
      <div className={'mt-4 flex flex-wrap gap-2'}>
        {clubUsers.map(clubUser => (
          <Link to={`/clubs/${clubUser.clubId}/users/${clubUser.userId}`} key={clubUser.id} className={'btn-ghost rounded-2xl'}>
            <pre className={'rounded-2xl border p-4'}>{JSON.stringify(clubUser.user, null, 2)}</pre>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AdminUsersMenu() {
  const { clubId } = useParams();

  return (
    <ResourceContextMenu>
      <li className={'disabled'}>
        <Link to={`/clubs/${clubId}/users/new`}>
          <div className={'flex flex-col items-center gap-0'}>
            <IoMdAddCircleOutline size={20} />
            <span className={`text-xs `}>Add</span>
          </div>
        </Link>
      </li>

      <li className={'disabled'}>
        <Link to={`/clubs/${clubId}/users/notify`}>
          <div className={'flex flex-col items-center gap-0'}>
            <AiOutlineMail size={20} />
            <span className={`text-xs`}>Notify</span>
          </div>
        </Link>
      </li>
    </ResourceContextMenu>
  );
}
