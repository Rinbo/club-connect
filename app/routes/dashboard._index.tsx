import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUserId } from '~/session.server';
import { findAllClubsByUserId } from '~/models/club.server';

export { ErrorBoundary } from '~/error-boundry';

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const clubs = await findAllClubsByUserId(userId);
  return json({ clubs });
};

export default function () {
  const { clubs } = useLoaderData<typeof loader>();
  return (
    <div className={'container mx-auto p-2 sm:p-4'}>
      <div className={'card sm:w-64'}>
        <div className={'flex flex-col gap-2'}>
          {clubs.length === 0 && <div>You have no clubs :(</div>}

          {clubs.map((club, index) => (
            <Link key={index} to={`/clubs/${club.id}`} className={'btn'}>
              {club.name}
            </Link>
          ))}

          <Link to="/notes" className="btn">
            Notes
          </Link>
        </div>
      </div>
    </div>
  );
}
