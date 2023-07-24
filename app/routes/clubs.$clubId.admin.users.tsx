import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubAdmin } from '~/session.server';
import { findClubUsersByClubId } from '~/models/club-user.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.clubId, 'clubId not present in route');
  await requireClubAdmin(request, params.clubId);
  const clubUsers = await findClubUsersByClubId(params.clubId);
  return json({ clubUsers });
};
export default function AdminUsers() {
  const { clubUsers } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className={'text-center text-5xl'}>Club Admin Users</div>

      <div className={'mt-4 flex gap-2'}>
        {clubUsers.map(clubUser => (
          <pre className={'rounded-2xl border p-4'} key={clubUser.id}>
            {JSON.stringify(clubUser.user, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  );
}
