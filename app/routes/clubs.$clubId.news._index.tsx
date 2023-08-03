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

export const loader = async ({ request, params: { clubId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing from route');
  const clubNews = await findClubNewsByClubId(clubId, 0, 20);

  return json({ clubNews });
};

export default function ClubNews() {
  const { clubNews } = useLoaderData<typeof loader>();
  const clubUserRoles = useClubUserRoles();

  return (
    <React.Fragment>
      {clubUserRoles.isWebmaster && <AdminClubNewsMenu />}
      <div className={'flex flex-wrap gap-2 '}>
        {clubNews.map(newsItem => (
          <div className={'border'} key={newsItem.id}>
            {JSON.stringify(newsItem, null, 2)}
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
