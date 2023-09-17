import { useLocation, useOutletContext } from 'react-router';
import React from 'react';
import type { TeamContext } from '~/routes/clubs.$clubId.teams.$teamId/route';
import ResourceContextMenu, { EditLink } from '~/components/nav/resource-context-menu';
import DeleteResourceModal from '~/components/delete/delete-resource-modal';
import { Link } from '@remix-run/react';
import TrainingTimeIsland from './training-time-island';

export default function Team() {
  const { teamRoles, trainingTimes, teamNews } = useOutletContext<TeamContext>();
  const { pathname } = useLocation();

  const contextMenu = (
    <ResourceContextMenu>
      <React.Fragment>
        <EditLink to={`${pathname}/edit`} />
        {teamRoles.isTeamLeader && (
          <DeleteResourceModal action={`${pathname}/delete`} message={'Are you sure you want to delete this team?'} />
        )}
      </React.Fragment>
    </ResourceContextMenu>
  );

  return (
    <main>
      {teamRoles.isTeamWebmaster && contextMenu}
      <div className={'flex flex-wrap gap-2 lg:flex-nowrap'}>
        <TrainingTimeIsland trainingTimes={trainingTimes} />

        <div className={'flex flex-col gap-1 overflow-hidden lg:flex-1'}>
          {teamNews.map(teamNewsItem => (
            <Link key={teamNewsItem.id} to={`${pathname}/news/${teamNewsItem.id}`}>
              <div className={'flex items-center gap-2 rounded-xl border p-2 hover:bg-base-300'}>
                {teamNewsItem.imageUrls[0] && (
                  <img className={'h-14 w-14 rounded-xl object-cover'} src={teamNewsItem.imageUrls[0].url} alt={'news preview'} />
                )}
                <div className={'flex-shrink-1 flex min-w-0 flex-col'}>
                  <div className={'whitespace-pre-wrap text-lg font-bold'}>{teamNewsItem.title}</div>
                  <div className={'truncate text-xs sm:text-sm'}>{teamNewsItem.body}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
