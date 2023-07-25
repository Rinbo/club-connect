import { useLoaderData } from '@remix-run/react';
import { json, LoaderArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';
import { findClubUserByUserId } from '~/models/club-user.server';

export const loader = async ({ request, params: { userId, clubId } }: LoaderArgs) => {
  invariant(userId, 'userId missing in route');
  invariant(clubId, 'clubId missing in route');
  await requireClubUser(request, clubId);

  const clubUser = await findClubUserByUserId(userId);
  return json({ clubUser });
};

export default function ClubUser() {
  const { clubUser } = useLoaderData<typeof loader>();

  return (
    <div>
      <pre>{JSON.stringify(clubUser, null, 2)}</pre>
    </div>
  );
}
