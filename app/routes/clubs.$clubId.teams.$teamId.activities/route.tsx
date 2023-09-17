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
import { FaLocationDot } from 'react-icons/fa6';
import { BiSolidTime } from 'react-icons/bi';
import { formatDate, formatTime } from '~/date-utils';
import { MdDateRange } from 'react-icons/md';

export type ClientTeamActivity = Omit<TeamActivity, 'startTime' | 'endTime' | 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
  startTime: string;
  endTime: string;
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
                  <Link key={teamActivity.id} to={pathname + '/' + teamActivity.id}>
                    <ActivityRow teamActivity={teamActivity} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}

function ActivityRow({ teamActivity }: { teamActivity: ClientTeamActivity }) {
  return (
    <div className={'flex flex-col gap-2 rounded-md border p-2 md:flex-row md:items-center'}>
      <div className={'flex flex-1 gap-2'}>
        <div className={'badge badge-ghost badge-sm w-24'}>{teamActivity.type}</div>
        <div className={'badge badge-sm flex gap-1'}>
          <FaLocationDot />
          {teamActivity.location}
        </div>
      </div>
      <div className={'badge badge-sm flex'}>
        <BiSolidTime className={'mr-1'} />
        <div>{formatTime(teamActivity.startTime)}</div>
        <div>-</div>
        <div>{formatTime(teamActivity.endTime)}</div>
      </div>
    </div>
  );
}
