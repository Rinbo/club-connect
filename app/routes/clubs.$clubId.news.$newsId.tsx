import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';
import { findClubNewsById } from '~/models/club-news.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request, params: { clubId, newsId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing from route');
  invariant(newsId, 'clubId missing from route');

  await requireClubUser(request, clubId);

  const clubNewsItem = await findClubNewsById(newsId);

  return json({ clubNewsItem });
};

export default function ClubNewsItems() {
  const { clubNewsItem } = useLoaderData<typeof loader>();
  return <pre>{JSON.stringify(clubNewsItem, null, 2)}</pre>;
}
