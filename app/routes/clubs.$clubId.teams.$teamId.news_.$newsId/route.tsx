import { useOutletContext } from 'react-router';
import type { TeamContext } from '~/routes/clubs.$clubId.teams.$teamId/route';
import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import type { TeamUserRoles } from '~/session.server';
import { requireClubUser } from '~/session.server';
import { getTeamNewsById } from '~/models/team-news.server';

type TeamNewsItem = {
  id: string;
  imageUrls: { url: string; id: string }[];
  title: string;
  body: string;
  author: { user: { name: string } } | null;
  createdAt: string;
};

export type TeamNewsContext = { teamRoles: TeamUserRoles; newsItem: TeamNewsItem };

export const loader = async ({ request, params: { clubId, newsId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing from route');
  invariant(newsId, 'clubId missing from route');

  await requireClubUser(request, clubId);

  const newsItem = await getTeamNewsById(newsId);

  return json({ newsItem });
};

export default function TeamNewsLayout() {
  const { teamRoles } = useOutletContext<TeamContext>();
  const { newsItem } = useLoaderData<{ newsItem: TeamNewsItem }>();

  return <Outlet context={{ teamRoles, newsItem } satisfies TeamNewsContext} />;
}
