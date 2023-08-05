import { Outlet } from '@remix-run/react';
import React from 'react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';
import { findClubNewsById } from '~/models/club-news.server';

export const loader = async ({ request, params: { clubId, newsId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing from route');
  invariant(newsId, 'clubId missing from route');

  await requireClubUser(request, clubId);

  const newsItem = await findClubNewsById(newsId);

  return json({ newsItem });
};

export default function ClubNewsLayout() {
  return <Outlet />;
}
