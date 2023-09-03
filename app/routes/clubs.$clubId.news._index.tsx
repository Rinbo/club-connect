import React from 'react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { findClubNewsByClubId } from '~/models/club-news.server';
import invariant from 'tiny-invariant';
import { useLoaderData, useParams } from '@remix-run/react';
import { useClubUserRoles } from '~/loader-utils';
import ResourceContextMenu, { AddLink } from '~/components/nav/resource-context-menu';
import { requireClubUser } from '~/session.server';
import NewsPreview from '~/components/news/news-preview';

export { ErrorBoundary } from '~/error-boundry';
export const loader = async ({ request, params: { clubId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing from route');
  await requireClubUser(request, clubId);
  const clubNews = await findClubNewsByClubId(clubId, 0, 20);

  return json({ clubNews });
};

export default function ClubNews() {
  const { clubNews } = useLoaderData<typeof loader>();
  const { clubId } = useParams();
  const clubUserRoles = useClubUserRoles();

  const contextMenu = (
    <ResourceContextMenu>
      <AddLink to={`/clubs/${clubId}/news/new`} />
    </ResourceContextMenu>
  );

  return (
    <main>
      {clubUserRoles.isWebmaster && contextMenu}
      <div className={'mb-4 flex flex-wrap justify-center gap-3 py-2'}>
        {clubNews.map(newsItem => (
          <NewsPreview key={newsItem.id} newsItem={newsItem} rootLink={`/clubs/${clubId}/news`} />
        ))}
      </div>
    </main>
  );
}
