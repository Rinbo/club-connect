import React from 'react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { findClubNewsByClubId } from '~/models/club-news.server';
import invariant from 'tiny-invariant';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import { useClubUserRoles } from '~/loader-utils';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { AiOutlineMail } from 'react-icons/ai';
import ResourceContextMenu from '~/components/nav/resource-context-menu';
import { requireClubUser } from '~/session.server';

export const loader = async ({ request, params: { clubId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing from route');
  await requireClubUser(request, clubId);
  const clubNews = await findClubNewsByClubId(clubId, 0, 20);

  return json({ clubNews });
};

export default function ClubNews() {
  const { clubNews } = useLoaderData<typeof loader>();
  const clubUserRoles = useClubUserRoles();

  return (
    <React.Fragment>
      {clubUserRoles.isWebmaster && <AdminClubNewsMenu />}
      <div className={'flex flex-wrap justify-center gap-3'}>
        {clubNews.map(newsItem => (
          <div key={newsItem.id} className="card bg-base-100 shadow-xl lg:card-side lg:w-2/3">
            {newsItem.imageUrls[0] && (
              <figure>
                <img src={newsItem.imageUrls[0].url} alt="news-item" className={'lg:object-fit lg:h-64 lg:w-72'} />
              </figure>
            )}
            <div className="card-body h-64 lg:w-72">
              <h2 className="card-title">{newsItem.title}</h2>
              <span className={'text-xs'}>{newsItem.author?.user.name}</span>
              <span className={'text-xs italic'}>{new Date(newsItem.createdAt).toDateString()}</span>
              <p className={'multi-line-truncate'}>{newsItem.body}</p>
              <div className="card-actions justify-end">
                <Link to={`/clubs/${newsItem.clubId}/news/${newsItem.id}`} className="btn btn-link">
                  Read more
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

function AdminClubNewsMenu() {
  const { clubId } = useParams();

  return (
    <ResourceContextMenu>
      <li>
        <Link to={`/clubs/${clubId}/news/new`}>
          <div className={'flex flex-col items-center gap-0'}>
            <IoMdAddCircleOutline size={20} />
            <span className={`text-xs `}>Add</span>
          </div>
        </Link>
      </li>

      <li>
        <Link to={`/clubs/${clubId}/users/notify`}>
          <div className={'flex flex-col items-center gap-0'}>
            <AiOutlineMail size={20} />
            <span className={`text-xs`}>Notify</span>
          </div>
        </Link>
      </li>
    </ResourceContextMenu>
  );
}
