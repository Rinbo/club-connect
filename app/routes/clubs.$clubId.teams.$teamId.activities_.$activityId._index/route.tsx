import { useLocation, useOutletContext } from 'react-router';
import ResourceContextMenu, { EditLink } from '~/components/nav/resource-context-menu';
import React from 'react';
import DeleteResourceModal from '~/components/delete/delete-resource-modal';
import type { TeamActivityContext } from '~/routes/clubs.$clubId.teams.$teamId.activities_.$activityId/route';
import TimeSpan from '~/components/timeloc/time-span';
import LocationBadge from '~/components/timeloc/location-badge';

export default function TeamActivity() {
  const { teamRoles, teamActivity, teamUsers } = useOutletContext<TeamActivityContext>();
  const { pathname } = useLocation();

  const prunedTeamUsers = teamUsers.map(teamUser => {
    const { clubUser } = teamUser;
    const { user } = clubUser;
    return { name: user.name };
  });

  const contextMenu = (
    <ResourceContextMenu backButton>
      {teamRoles.isTeamWebmaster && (
        <React.Fragment>
          <EditLink to={`${pathname}/edit`} />
          <DeleteResourceModal action={`${pathname}`} message={'Are you sure you want to delete this activity?'} />
        </React.Fragment>
      )}
    </ResourceContextMenu>
  );

  return (
    <main>
      {contextMenu}
      <section className={'flex justify-center py-1'}>
        <div className={'flex w-full flex-col justify-center gap-3 rounded-lg border p-2 lg:max-w-2xl'}>
          <h1 className={'text-center text-xl uppercase'}>Activity</h1>
          <div className={'flex flex-wrap items-center gap-2'}>
            <div className={'badge badge-neutral'}>{teamActivity.type}</div>
            <LocationBadge location={teamActivity.location} />
            <TimeSpan startTime={teamActivity.startTime} endTime={teamActivity.endTime} />
          </div>
          <article className={'prose'}>
            <p>{teamActivity.description}</p>
          </article>
          <div className={'divider mx-8'}>Members</div>
          <div className={'flex flex-wrap gap-2'}>
            {teamUsers.map(teamUser => (
              <div className={'badge'} key={teamUser.id}>
                {teamUser.clubUser.user.name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
