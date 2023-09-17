import { useOutletContext } from 'react-router';
import type { ClientTeamActivity } from '~/routes/clubs.$clubId.teams.$teamId.activities/route';
import React from 'react';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { deleteTeamActivity, findTeamActivityById } from '~/models/team-activity.server';
import invariant from 'tiny-invariant';
import { Outlet, useLoaderData } from '@remix-run/react';
import type { TeamUserRoles } from '~/session.server';
import { requireClubUser, requireTeamWebmaster } from '~/session.server';
import type { TeamContext } from '~/routes/clubs.$clubId.teams.$teamId/route';
import { createTeamActivitiesPath } from '~/route-utils';

export type TeamActivityContext = { teamRoles: TeamUserRoles; teamActivity: ClientTeamActivity };

export const loader = async ({ request, params: { clubId, activityId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(activityId, 'activityId missing in route');
  await requireClubUser(request, clubId);

  const teamActivity = await findTeamActivityById(activityId);
  return json({ teamActivity });
};

export const action = async ({ request, params: { clubId, teamId, activityId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');
  invariant(activityId, 'activityId missing in route');
  await requireTeamWebmaster(request, clubId, teamId);

  await deleteTeamActivity(activityId);

  return redirect(createTeamActivitiesPath(clubId, teamId));
};

export default function TeamActivityLayout() {
  const { teamActivity } = useLoaderData<typeof loader>();
  const { teamRoles } = useOutletContext<TeamContext>();

  return <Outlet context={{ teamRoles, teamActivity } satisfies TeamActivityContext} />;
}
