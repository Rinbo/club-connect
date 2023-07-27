import { Link, Outlet, useLoaderData, useNavigate, useParams } from '@remix-run/react';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineEdit, AiOutlineMail } from 'react-icons/ai';
import { useClubUserRoles } from '~/loader-utils';
import { json, LoaderArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';
import { findClubUserByClubIdAndUserId } from '~/models/club-user.server';

export const loader = async ({ request, params: { userId, clubId } }: LoaderArgs) => {
  invariant(userId, 'userId missing in route');
  invariant(clubId, 'clubId missing in route');
  await requireClubUser(request, clubId);

  const clubUser = await findClubUserByClubIdAndUserId(clubId, userId);
  return json({ clubUser });
};
export default function ClubUserLayout() {
  const clubUserRoles = useClubUserRoles()

  return (
    <div>
      {clubUserRoles.isAdmin && <AdminUserMenu />}
      <Outlet />
    </div>
  );
}

function AdminUserMenu() {
  const { clubId, userId } = useParams();
  const navigate = useNavigate();

  return (
    <ul className="menu-animate-down no-scrollbar menu rounded-box menu-horizontal menu-xs mb-2 w-full flex-nowrap gap-2 overflow-x-auto bg-base-200 py-0 sm:justify-center">
      <li className={'border-r-base-base-300 border-r-2 pr-2'}>
        <button onClick={() => navigate(-1)}>
          <div className={'flex flex-col items-center gap-0'}>
            <IoIosArrowBack size={20} />
            <span className={`text-xs `}>Back</span>
          </div>
        </button>
      </li>
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
    </ul>
  );
}
