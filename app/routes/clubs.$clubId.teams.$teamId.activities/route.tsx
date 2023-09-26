import { Link, useLoaderData } from '@remix-run/react';
import { useLocation, useOutletContext } from 'react-router';
import type { TeamContext } from '~/routes/clubs.$clubId.teams.$teamId/route';
import { requireClubUser } from '~/session.server';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { findTeamActivities } from '~/models/team-activity.server';
import type { TeamActivity } from '@prisma/client';
import ResourceContextMenu, { AddLink } from '~/components/nav/resource-context-menu';
import TrainingTimeIsland from '~/routes/clubs.$clubId.teams.$teamId._index/training-time-island';
import React from 'react';
import { formatDate } from '~/date-utils';
import { MdAddCircleOutline, MdDateRange } from 'react-icons/md';
import TimeSpan from '~/components/timeloc/time-span';
import LocationBadge from '~/components/timeloc/location-badge';

export type ClientTeamActivity = Omit<TeamActivity, 'startTime' | 'endTime' | 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
  startTime: string;
  endTime: string;
  coming: { id: string }[];
  present: { id: string }[];
};

type LoaderData = { teamActivities: ClientTeamActivity[] };

export const loader = async ({ request, params: { clubId, teamId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');

  await requireClubUser(request, clubId);
  const teamActivities = await findTeamActivities(teamId, 0, 10);

  return json({ teamActivities });
};

export default function TeamActivitiesLayout() {
  const { pathname } = useLocation();
  const { teamActivities } = useLoaderData<LoaderData>();
  const { teamRoles, trainingTimes } = useOutletContext<TeamContext>();

  const dateMap = React.useMemo(() => {
    const map = new Map<string, ClientTeamActivity[]>();
    for (const teamActivity of teamActivities) {
      const startDate = formatDate(teamActivity.startTime);
      const activities = map.get(startDate) ?? [];
      activities.push(teamActivity);
      map.set(startDate, activities);
    }
    return map;
  }, [teamActivities]);

  const contextMenu = (
    <ResourceContextMenu>
      <AddLink to={`${pathname}/new`} />
    </ResourceContextMenu>
  );

  return (
    <main>
      {teamRoles.isTeamWebmaster && contextMenu}
      <section className={'flex flex-wrap gap-2'}>
        <TrainingTimeIsland trainingTimes={trainingTimes} />
        <section className={'flex grow flex-col gap-2 rounded-xl border p-3'}>
          <h3 className={'text-center text-xl'}>Upcoming Activities</h3>
          {Array.from(dateMap.entries()).map(([date, teamActivities]) => (
            <div key={date}>
              <div className={'flex items-center gap-1 font-mono text-sm'}>
                <MdDateRange />
                <span>{date}</span>
              </div>
              <div className={'flex flex-col gap-1'}>
                {teamActivities.map(teamActivity => (
                  <ActivityRow key={teamActivity.id} teamActivity={teamActivity} path={pathname + '/' + teamActivity.id} />
                ))}
              </div>
            </div>
          ))}
          <div className={'flex justify-center'}>
            <Link to={`${pathname}/new`}>
              <MdAddCircleOutline size={20} />
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function ActivityRow({ teamActivity, path }: { teamActivity: ClientTeamActivity; path: string }) {
  return (
    <div className={'flex flex-col gap-2 rounded-md border p-2 md:flex-row md:items-center'}>
      <div className={'flex flex-1 gap-2'}>
        <div className={'badge badge-ghost badge-sm w-24'}>{teamActivity.type}</div>
        <LocationBadge location={teamActivity.location} />
      </div>
      <TimeSpan startTime={teamActivity.startTime} endTime={teamActivity.endTime} />
      <Link to={path} className={'btn btn-primary btn-outline btn-xs'}>
        Details
      </Link>
    </div>
  );
}
