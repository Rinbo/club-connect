import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireUserId } from '~/session.server';
import { findClubUsersByNameContains } from '~/models/club-user.server';

export const loader = async ({ request, params: { clubId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing in route');

  await requireUserId(request);

  const url = new URL(request.url);
  const clubUserNameQuery = url.searchParams.get('name-query');
  if (!clubUserNameQuery) return json({ clubUsers: [] });

  return json({ clubUsers: await findClubUsersByNameContains(clubUserNameQuery, clubId, 6) });
};
