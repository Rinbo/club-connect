import { Link } from '@remix-run/react';
import { useClub, useUser } from '~/loader-utils';

export default function Club() {
  const club = useClub();
  const user = useUser();

  return (
    <div>
      <Link to={'/dashboard'} className={'inline-flex rounded bg-indigo-500 p-2 text-slate-200'}>
        Dashboard
      </Link>
      <div className={'my-4'}>
        <pre>USER: {JSON.stringify(user, null, 2)}</pre>
        <hr className={'my-4'} />
        <pre>CLUB: {JSON.stringify(club, null, 2)}</pre>
      </div>
    </div>
  );
}
