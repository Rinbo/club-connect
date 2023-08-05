import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubUser } from '~/session.server';
import { findClubNewsById } from '~/models/club-news.server';
import { useLoaderData } from '@remix-run/react';
import React from 'react';
import ImageModal from '~/components/image/image-modal';

export const loader = async ({ request, params: { clubId, newsId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing from route');
  invariant(newsId, 'clubId missing from route');

  await requireClubUser(request, clubId);

  const newsItem = await findClubNewsById(newsId);

  return json({ newsItem });
};

export default function ClubNewsItems() {
  const { newsItem } = useLoaderData<typeof loader>();
  return (
    <div className={'mt-4 flex justify-center'}>
      <div className="card card-compact bg-base-100 shadow-xl lg:w-4/5">
        {newsItem.imageUrls[0] && (
          <figure>
            <img src={newsItem.imageUrls[0].url} alt="news-item" />
          </figure>
        )}
        <div className="card-body">
          <h2 className="card-title">{newsItem.title}</h2>
          <span className={'text-xs text-accent-content'}>{newsItem.author?.user.name}</span>
          <span className={'text-xs italic text-neutral-content'}>{new Date(newsItem.createdAt).toDateString()}</span>
          <p className={'whitespace-pre-line'}>{newsItem.body}</p>
          <div className={'card-actions mt-4'}>
            {newsItem.imageUrls.map(imageUrl => (
              <ImageModal key={imageUrl.id} url={imageUrl.url} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
