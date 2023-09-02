import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireTeamLeader } from '~/session.server';
import { errorFlash } from '~/loader-utils';
import { getMessageOrDefault } from '~/misc-utils';
import { deleteTeam } from '~/models/team.server';

export const action = async ({ request, params: { clubId, teamId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');
  await requireTeamLeader(request, clubId, teamId);

  try {
    await deleteTeam(teamId);
  } catch (e) {
    return json({ flash: errorFlash(getMessageOrDefault(e, 'Remove operation failed')) }, { status: 500 });
  }

  return redirect(`/clubs/${clubId}/teams`);
};
