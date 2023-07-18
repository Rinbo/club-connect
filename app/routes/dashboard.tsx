import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUserId } from '~/session.server';
import { findAllClubsByUserId } from '~/models/club.server';
import { Link, useLoaderData } from '@remix-run/react';
import LogoutButton from '~/components/misc/logout-button';

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const clubs = await findAllClubsByUserId(userId);
  return json({ clubs });
};

export default function Dashboard() {
  const { clubs } = useLoaderData<typeof loader>();

  return (
    <div className={'h-full'}>
      <div className={'flex items-center justify-between bg-teal-600'}>
        <div className={'text-lg text-slate-300'}>Dashboard nav</div>
        <LogoutButton />
      </div>

      {clubs.length === 0 && <div>You have no clubs :(</div>}

      <div className={'my-2 p-2'}>
        {clubs.map((club, index) => (
          <Link key={index} to={`/clubs/${club.id}`} className={'inline-flex rounded bg-teal-600 p-2 text-slate-200'}>
            {club.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
