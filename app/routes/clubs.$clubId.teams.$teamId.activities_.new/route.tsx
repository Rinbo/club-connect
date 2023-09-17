import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireTeamWebmaster } from '~/session.server';
import { createTeamActivity } from '~/models/team-activity.server';
import { errorFlash } from '~/loader-utils';
import { getMessageOrDefault } from '~/misc-utils';
import TeamActivityForm, { teamActivityFormValidation } from '~/components/form/TeamActivityForm';
import { createTeamActivityPath } from '~/route-utils';

export const action = async ({ request, params: { clubId, teamId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');
  await requireTeamWebmaster(request, clubId, teamId);

  const { error, data } = await teamActivityFormValidation(request);

  if (error) return error;

  try {
    const teamActivity = await createTeamActivity(teamId, data);
    return redirect(createTeamActivityPath(clubId, teamId, teamActivity.id));
  } catch (e) {
    return json({ flash: errorFlash(getMessageOrDefault(e, 'Failed to create training activity')) }, { status: 500 });
  }
};

export default function CreateActivity() {
  return (
    <section className={'flex justify-center py-4'}>
      <TeamActivityForm />
    </section>
  );
}
