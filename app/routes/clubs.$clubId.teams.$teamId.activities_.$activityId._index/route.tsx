import { useLocation, useOutletContext } from 'react-router';
import ResourceContextMenu, { EditLink } from '~/components/nav/resource-context-menu';
import React from 'react';
import DeleteResourceModal from '~/components/delete/delete-resource-modal';
import type { TeamActivityContext } from '~/routes/clubs.$clubId.teams.$teamId.activities_.$activityId/route';
import TimeSpan from '~/components/timeloc/time-span';
import LocationBadge from '~/components/timeloc/location-badge';

/**
 * We need a button for sending request for joining - This means a user or a parent needs a link to which they can
 * register their intention to join - probably need a different route for that, if user is parent and has a child in team
 * then he can add the child. Otherwise, if user is a player in team they can also register their intention
 * As it stands now, if a user says no, there is no way to signal this, so perhaps the present/coming relation should not be
 * clubUser, but rather some different model that has fields that are more descriptive, ie, leaders should be able to see if
 * the user rejected the invite or if they simply haven't answered. Why didn't I think of that before? This is a major change
 * I think.
 *
 * Furthermore, we need to have some button that a leader/webmaster can press which triggers a mail to go out to the
 * team members. This would require some kind of queue to which one adds a job. The job gets picked up by a worker
 * and sends the emails at a moderate rate. When all emails have been sent, it should mark send job as completed,
 * and ideally update some field in the ui in real time (polling, revalidation or websocket?)
 *
 * Lastly, I need some kind of presence checker. It should be smooth and intuitive, listing at the top the users
 * that said they were coming (in one color), and the ones that have said they are not coming below. These should be
 * possible to click on to register presence though (in case they showed up anyway)
 */
export default function TeamActivity() {
  const { teamRoles, teamActivity, teamUsers } = useOutletContext<TeamActivityContext>();
  const { pathname } = useLocation();

  const baseTeamUsers = React.useMemo(
    () =>
      teamUsers.map(teamUser => {
        const { clubUser } = teamUser;
        const { user, id } = clubUser;
        return { clubUserId: id, name: user.name };
      }),
    [teamUsers]
  );

  const comingClubUserIds = React.useMemo(() => teamActivity.coming.map(e => e.id), [teamActivity]);
  const presentClubUsersIds = React.useMemo(() => teamActivity.present.map(e => e.id), [teamActivity]);

  const comingTeamUsers = React.useMemo(
    () => baseTeamUsers.filter(baseUser => comingClubUserIds.includes(baseUser.clubUserId)),
    [baseTeamUsers, comingClubUserIds]
  );

  const presentTeamUsers = React.useMemo(
    () => baseTeamUsers.filter(baseUser => presentClubUsersIds.includes(baseUser.clubUserId)),
    [baseTeamUsers, presentClubUsersIds]
  );

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
        <div className={'flex w-full flex-col justify-center gap-3 rounded-lg border px-2 py-4 lg:max-w-2xl'}>
          <h1 className={'text-center text-xl uppercase'}>Activity</h1>
          <div className={'flex flex-wrap items-center gap-2'}>
            <div className={'badge badge-neutral'}>{teamActivity.type}</div>
            <LocationBadge location={teamActivity.location} />
            <TimeSpan startTime={teamActivity.startTime} endTime={teamActivity.endTime} />
          </div>
          <article className={'prose'}>
            <p>{teamActivity.description}</p>
          </article>
          <div className={'divider mx-8'}>Team Members</div>
          <div className={'flex flex-wrap gap-2'}>
            {baseTeamUsers.map(teamUser => (
              <div className={'badge'} key={teamUser.clubUserId + 'members'}>
                {teamUser.name}
              </div>
            ))}
          </div>

          <div className={'divider mx-8'}>Coming</div>
          <div className={'flex flex-wrap gap-2'}>
            {comingTeamUsers.map(teamUser => (
              <div className={'badge'} key={teamUser.clubUserId + 'coming'}>
                {teamUser.name}
              </div>
            ))}
          </div>

          <div className={'divider mx-8'}>Present</div>
          <div className={'flex flex-wrap gap-2'}>
            {presentTeamUsers.map(teamUser => (
              <div className={'badge'} key={teamUser.clubUserId + 'present'}>
                {teamUser.name}
              </div>
            ))}
          </div>
        </div>
        <button></button>
      </section>
    </main>
  );
}
