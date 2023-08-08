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
import { getGravatarUrl } from '~/misc-utils';

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
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {clubUserRoles.isAdmin && (
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
              )}
              <th>Name</th>
              <th>Role</th>
              <th>Join date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clubUsers.map(({ user, id, clubId, userId, createdAt, clubRoles }) => (
              <tr key={id}>
                {clubUserRoles.isAdmin && (
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                )}
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={user.imageUrl ? user.imageUrl : getGravatarUrl(user.email)} alt="User profile" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-sm opacity-50">City</div>
                    </div>
                  </div>
                </td>
                <td>
                  {clubRoles.map(role => (
                    <span key={`${user.id}-${role}`} className="badge badge-ghost badge-sm">
                      {role}
                    </span>
                  ))}
                </td>
                <td>{new Date(createdAt).toDateString()}</td>
                <th>
                  <Link to={`/clubs/${clubId}/users/${userId}`} key={`link-${id}`} className={'btn btn-ghost btn-xs'}>
                    Details
                  </Link>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
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
