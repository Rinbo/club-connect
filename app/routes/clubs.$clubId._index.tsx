import { Link, useLoaderData } from '@remix-run/react';
import { json, LoaderArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';
import { findClubById } from '~/models/club.server';
import { getUserById } from '~/models/user.server';

export const loader = async ({ params, request }: LoaderArgs) => {
  const clubId = params.clubId;
  invariant(clubId, 'clubId not found');

  const userId = await requireClubUser(request, clubId);

  const club = await findClubById(clubId);
  const user = await getUserById(userId);
  return json({ user, club });
};

export default function Club() {
  const { user, club } = useLoaderData<typeof loader>();
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
