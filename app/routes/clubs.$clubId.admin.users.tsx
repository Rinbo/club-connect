import { Link, Outlet, useParams } from '@remix-run/react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { AiOutlineMail } from 'react-icons/ai';

export default function AdminUsersLayout() {
  return (
    <div>
      <AdminUsersMenu />
      <Outlet />
    </div>
  );
}

function AdminUsersMenu() {
  const { clubId } = useParams();

  return (
    <ul className="menu-animate-down no-scrollbar menu rounded-box menu-horizontal menu-xs mb-2 w-full flex-nowrap gap-2 overflow-x-auto bg-base-200 py-0 sm:justify-center">
      <li>
        <Link to={`/clubs/${clubId}/admin/users/new`}>
          <div className={'flex flex-col items-center gap-0'}>
            <IoMdAddCircleOutline size={20} />
            <span className={`text-xs `}>Add</span>
          </div>
        </Link>
      </li>
      <li>
        <Link to={`/clubs/${clubId}/admin/users/notify`}>
          <div className={'flex flex-col items-center gap-0'}>
            <AiOutlineMail size={20} />
            <span className={`text-xs`}>Notify</span>
          </div>
        </Link>
      </li>
    </ul>
  );
}
