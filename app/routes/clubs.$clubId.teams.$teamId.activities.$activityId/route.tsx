import { useOutletContext } from 'react-router';
import type { ClientTeamActivity, TeamActivitiesContext } from '~/routes/clubs.$clubId.teams.$teamId.activities/route';
import React from 'react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { findTeamActivityById } from '~/models/team-activity.server';
import invariant from 'tiny-invariant';
import { Outlet, useLoaderData } from '@remix-run/react';
import type { TeamUserRoles } from '~/session.server';

export type TeamActivityContext = { teamRoles: TeamUserRoles; teamActivity: ClientTeamActivity };

export const loader = async ({ request, params: { clubId, activityId } }: LoaderArgs) => {
  invariant(clubId, '');
  invariant(activityId, '');

  const teamActivity = await findTeamActivityById(activityId);
  return json({ teamActivity });
};

export default function TeamActivityLayout() {
  const { teamActivity } = useLoaderData<typeof loader>();
  const { teamRoles } = useOutletContext<TeamActivitiesContext>();

  return <Outlet context={{ teamRoles, teamActivity } satisfies TeamActivityContext} />;
}
