import { Link, useParams } from '@remix-run/react';
import React from 'react';
import ImageModal from '~/components/image/image-modal';
import ResourceContextMenu from '~/components/nav/resource-context-menu';
import { useClubNewsItem, useClubUserRoles } from '~/loader-utils';
import { BiEdit } from 'react-icons/bi';

export default function ClubNewsItems() {
  const newsItem = useClubNewsItem();
  const clubUserRoles = useClubUserRoles();

  return (
    <React.Fragment>
      <NewsItemContextMenu isWebmaster={clubUserRoles.isWebmaster} />
      <div className={'my-4 flex justify-center'}>
        <div className="card card-compact w-full bg-base-100 shadow-xl lg:max-w-4xl">
          {newsItem.imageUrls[0] && (
            <figure>
              <img src={newsItem.imageUrls[0].url} alt="news-item" className={'h-96 w-full rounded-t-lg object-cover'} />
            </figure>
          )}
          <div className="card-body">
            <div className={'flex flex-row flex-wrap items-center justify-between'}>
              <h2 className="card-title text-3xl">{newsItem.title}</h2>
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

function NewsItemContextMenu(props: { isWebmaster: boolean }) {
  const { clubId, newsId } = useParams();

  return (
    <ResourceContextMenu>
      {props.isWebmaster && (
        <li>
          <Link to={`/clubs/${clubId}/news/${newsId}/edit`}>
            <div className={'flex flex-col items-center gap-0'}>
              <BiEdit size={20} />
              <span className={`text-xs `}>Edit</span>
            </div>
          </Link>
        </li>
      )}
    </ResourceContextMenu>
  );
}
