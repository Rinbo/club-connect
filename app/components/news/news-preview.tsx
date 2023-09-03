import { Link } from '@remix-run/react';
import React from 'react';

type NewsItem = {
  id: string;
  imageUrls: { url: string }[];
  title: string;
  body: string;
  author: { user: { name: string } } | null;
  createdAt: string;
};

type Props = { newsItem: NewsItem; rootLink: string };

export default function NewsPreview({ newsItem, rootLink }: Props) {
  return (
    <div className="card w-full bg-base-100 shadow-xl lg:card-side lg:w-3/4">
      {newsItem.imageUrls[0] && (
        <figure>
          <img src={newsItem.imageUrls[0].url} alt="news-item" className={'lg:object-fit lg:h-64 lg:w-72'} />
        </figure>
      )}
      <div className="card-body h-64 lg:w-72">
        <h2 className="card-title text-2xl">{newsItem.title}</h2>
        <span className={'text-xs'}>{newsItem.author?.user.name}</span>
        <span className={'text-xs italic'}>{new Date(newsItem.createdAt).toDateString()}</span>
        <p className={'multi-line-truncate'}>{newsItem.body}</p>
        <div className="card-actions justify-end">
          <Link to={`${rootLink}/${newsItem.id}`} className="btn btn-link">
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}
