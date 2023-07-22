import { AiOutlineUser } from 'react-icons/ai';
import { Link } from '@remix-run/react';
import LogoutButton from '~/components/misc/logout-button';

export default function UserCircle() {
  return (
    <div className="dropdown-end dropdown">
      <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
        <div className="indicator">
          <AiOutlineUser size={30} />
        </div>
      </label>
      <ul tabIndex={0} className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-200 p-2 shadow">
        <li>
          <Link to={'/dashboard/profile'}>
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li>
          <Link to={'/dashboard/settings'}>Settings</Link>
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </div>
  );
}
