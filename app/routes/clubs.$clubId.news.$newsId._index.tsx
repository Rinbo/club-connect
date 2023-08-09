import { Link, useParams } from '@remix-run/react';
import React from 'react';
import ImageModal from '~/components/image/image-modal';
import ResourceContextMenu from '~/components/nav/resource-context-menu';
import { useClubNewsItem, useClubUserRoles } from '~/loader-utils';
import { BiEdit } from 'react-icons/bi';
import DeleteResourceModal from '~/components/delete/delete-resource-modal';
import ImageManagerModal from '~/components/image/image-manager-modal';

export default function ClubNewsItems() {
  const { clubId, newsId } = useParams();
  const newsItem = useClubNewsItem();
  const clubUserRoles = useClubUserRoles();

  const contextMenu = (
    <ResourceContextMenu backButton>
      {clubUserRoles.isWebmaster && (
        <React.Fragment>
          <li>
            <Link to={`/clubs/${clubId}/news/${newsId}/edit`}>
              <div className={'flex flex-col items-center gap-0'}>
                <BiEdit size={20} />
                <span className={`text-xs `}>Edit</span>
              </div>
            </Link>
          </li>
          <ImageManagerModal
            imageUrls={newsItem.imageUrls}
            postAction={`/clubs/${clubId}/news/${newsId}/add-images`}
            deleteAction={`/clubs/${clubId}/news/delete-images`}
          />
          <DeleteResourceModal action={`/clubs/${clubId}/news/${newsId}/delete`} message={'Are you sure you want to delete this post?'} />
        </React.Fragment>
      )}
    </ResourceContextMenu>
  );

  return (
    <React.Fragment>
      {contextMenu}
      <div className={'mb-4 flex justify-center'}>
        <div className="card card-compact w-full bg-base-100 shadow-xl lg:max-w-4xl">
          {newsItem.imageUrls[0] && (
            <figure>
              <img src={newsItem.imageUrls[0].url} alt="news-item" className={'h-96 w-full rounded-t-lg object-cover'} />
            </figure>
          )}
          <div className="card-body">
            <div className={'flex flex-row flex-wrap items-center'}>
              <h2 className="card-title flex-grow items-baseline text-3xl">{newsItem.title}</h2>
              <div className={'badge badge-neutral'}>{newsItem.isPublic ? 'Public' : 'Private'}</div>
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
    </React.Fragment>
  );
}
