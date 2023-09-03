import ResourceContextMenu, { AddLink } from '~/components/nav/resource-context-menu';
import NewsPreview from '~/components/news/news-preview';
import React from 'react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import { useOutletContext } from 'react-router';
import type { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId/route';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';
import { findClubNews } from '~/models/team-news.server';

export const loader = async ({ request, params: { clubId, teamId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing from route');
  invariant(teamId, 'teamId missing from route');
  await requireClubUser(request, clubId);

  const teamNews = await findClubNews(clubId, teamId, 0, 20);

  return json({ teamNews });
};

export default function TeamNews() {
  const { clubId, teamId } = useParams();
  const { teamRoles } = useOutletContext<TeamContextType>();
  const { teamNews } = useLoaderData<typeof loader>();

  const contextMenu = (
    <ResourceContextMenu>
      <AddLink to={`/clubs/${clubId}/teams/${teamId}/news/new`} />
    </ResourceContextMenu>
  );

  return (
    <main>
      {teamRoles.isTeamWebmaster && contextMenu}
      <div className={'mb-4 flex flex-wrap justify-center gap-3 py-2'}>
        {teamNews.map(newsItem => (
          <NewsPreview key={newsItem.id} newsItem={newsItem} rootLink={`/clubs/${clubId}/teams/${teamId}/news`} />
        ))}
      </div>
    </main>
  );
}
