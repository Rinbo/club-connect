import TeamActivityForm, { teamActivityFormValidation } from '~/components/form/TeamActivityForm';
import { useOutletContext } from 'react-router';
import type { TeamActivityContext } from '~/routes/clubs.$clubId.teams.$teamId.activities_.$activityId/route';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireTeamWebmaster } from '~/session.server';
import { errorFlash } from '~/loader-utils';
import { updateTeamActivity } from '~/models/team-activity.server';
import { getMessageOrDefault } from '~/misc-utils';
import { createTeamActivityPath } from '~/route-utils';

export const action = async ({ request, params: { clubId, teamId, activityId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');
  invariant(activityId, 'activityId missing in route');
  await requireTeamWebmaster(request, clubId, teamId);

  const { error, data } = await teamActivityFormValidation(request);

  if (error) return error;

  try {
    const teamActivity = await updateTeamActivity(activityId, data);
    return redirect(createTeamActivityPath(clubId, teamId, teamActivity.id));
  } catch (e) {
    return json({ flash: errorFlash(getMessageOrDefault(e, 'Failed to create training activity')) }, { status: 500 });
  }
};

export default function EditTeamActivity() {
  const { teamActivity } = useOutletContext<TeamActivityContext>();

  return (
    <main className={'flex justify-center py-4'}>
      <TeamActivityForm defaultValues={teamActivity} />
    </main>
  );
}
