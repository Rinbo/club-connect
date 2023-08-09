import React from 'react';
import { Link, Outlet, useParams } from '@remix-run/react';
import { AiOutlineEdit, AiOutlineMail } from 'react-icons/ai';
import { useClubUserRoles } from '~/loader-utils';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';
import { findClubUserByClubIdAndUserId } from '~/models/club-user.server';
import ResourceContextMenu from '~/components/nav/resource-context-menu';

export const loader = async ({ request, params: { userId, clubId } }: LoaderArgs) => {
  invariant(userId, 'userId missing in route');
  invariant(clubId, 'clubId missing in route');
  await requireClubUser(request, clubId);

  const clubUser = await findClubUserByClubIdAndUserId(clubId, userId);
  return json({ clubUser });
};
export default function ClubUserLayout() {
  const clubUserRoles = useClubUserRoles();
  const { clubId, userId } = useParams();

  const contextMenu = (
    <ResourceContextMenu backButton>
      {clubUserRoles.isAdmin && (
        <React.Fragment>
          <li>
            <Link to={`/clubs/${clubId}/users/${userId}/edit`}>
              <div className={'flex flex-col items-center gap-0'}>
                <AiOutlineEdit size={20} />
                <span className={`text-xs `}>Edit</span>
              </div>
            </Link>
          </li>

          <li>
            <Link to={`/clubs/${clubId}/users/${userId}/notify`}>
              <div className={'flex flex-col items-center gap-0'}>
                <AiOutlineMail size={20} />
                <span className={`text-xs`}>Notify</span>
              </div>
            </Link>
          </li>
        </React.Fragment>
      )}
    </ResourceContextMenu>
  );

  return (
    <div>
      {contextMenu}
      <Outlet />
    </div>
  );
}
