import { Link, useParams } from '@remix-run/react';
import React from 'react';
import ImageModal from '~/components/image/image-modal';
import ResourceContextMenu from '~/components/nav/resource-context-menu';
import { useClubNewsItem, useClubUserRoles } from '~/loader-utils';
import { BiEdit } from 'react-icons/bi';
import HoveringBackButton from '~/components/nav/hovering-back-button';
import DeleteResourceModal from '~/components/delete/delete-resource-modal';
import ImageManagerModal from '~/components/image/image-manager-modal';

export default function ClubNewsItems() {
  const { clubId, newsId } = useParams();
  const newsItem = useClubNewsItem();
  const clubUserRoles = useClubUserRoles();

  const contextMenu = (
    <ResourceContextMenu>
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
    </ResourceContextMenu>
  );

  return (
    <React.Fragment>
      {clubUserRoles.isWebmaster && contextMenu}
      <div className={'my-4 flex justify-center'}>
        <div className="card card-compact w-full bg-base-100 shadow-xl lg:max-w-4xl">
          <HoveringBackButton />
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

/*function DeleteImagesSection(props: { imageUrls: ImageUrl[] }) {
  const fetcher = useFetcher();
  const { clubId } = useParams();

  return (
    <section className={'flex justify-center'}>
      <div className={'mt-3 w-full max-w-4xl'}>
        <h2 className={'mb-2 text-xl'}>Image manager</h2>
        <fetcher.Form
          className={'flex flex-row flex-wrap gap-3 rounded-xl border p-3'}
          action={`/clubs/${clubId}/news/delete-images`}
          method={'delete'}
        >
          {props.imageUrls.map(imageUrl => (
            <div key={imageUrl.id} className="relative w-28 rounded">
              <input
                name={'imageUrls-' + imageUrl.id}
                value={JSON.stringify(imageUrl)}
                type="checkbox"
                className="checkbox absolute right-1 top-1 z-10 border border-black bg-white"
              />
              <img src={imageUrl.url} alt="thumbnail" className={'rounded'} />
            </div>
          ))}
          <div className={'w-full'}></div>
          <button type={'submit'} className={'btn btn-warning'}>
            Delete
          </button>
        </fetcher.Form>
      </div>
    </section>
  );
}*/
