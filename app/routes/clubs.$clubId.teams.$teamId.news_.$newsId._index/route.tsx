import { useLocation, useOutletContext } from 'react-router';
import type { TeamNewsContext } from '~/routes/clubs.$clubId.teams.$teamId.news_.$newsId/route';
import ResourceContextMenu, { EditLink } from '~/components/nav/resource-context-menu';
import React from 'react';
import ImageManagerModal from '~/components/image/image-manager-modal';
import DeleteResourceModal from '~/components/delete/delete-resource-modal';
import ImageModal from '~/components/image/image-modal';

export default function TeamNewsItem() {
  const { teamRoles, newsItem } = useOutletContext<TeamNewsContext>();
  const { pathname } = useLocation();

  const contextMenu = (
    <ResourceContextMenu backButton>
      {teamRoles.isTeamWebmaster && (
        <React.Fragment>
          <EditLink to={`${pathname}/edit`} />
          <ImageManagerModal
            imageUrls={newsItem.imageUrls}
            postAction={`${pathname}/add-images`}
            deleteAction={`${pathname}/delete-images`}
          />
          <DeleteResourceModal action={`${pathname}/delete`} message={'Are you sure you want to delete this post?'} />
        </React.Fragment>
      )}
    </ResourceContextMenu>
  );

  return (
    <main>
      {contextMenu}
      <div className={'mb-4 flex justify-center py-2'}>
        <div className="card-compact card w-full bg-base-100 shadow-xl lg:max-w-4xl">
          {newsItem.imageUrls[0] && (
            <figure>
              <img src={newsItem.imageUrls[0].url} alt="news-item" className={'h-96 w-full rounded-t-lg object-cover'} />
            </figure>
          )}
          <div className="card-body">
            <div className={'flex flex-row flex-wrap items-center'}>
              <h2 className="card-title flex-grow items-baseline text-3xl">{newsItem.title}</h2>
            </div>
            <span className={'text-xs text-accent-content'}>{newsItem.author?.user.name}</span>
            <span className={'mb-2 text-xs italic'}>{new Date(newsItem.createdAt).toDateString()}</span>
            <p className={'whitespace-pre-line'}>{newsItem.body}</p>
            <div className={'card-actions mt-4'}>
              {newsItem.imageUrls.map(imageUrl => (
                <ImageModal key={imageUrl.id} url={imageUrl.url} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
