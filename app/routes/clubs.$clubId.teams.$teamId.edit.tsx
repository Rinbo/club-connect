import { useOutletContext } from 'react-router';
import TeamForm, { teamSchema } from '~/components/form/team-form';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubAdmin } from '~/session.server';
import { updateTeam } from '~/models/team.server';
import type { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId/route';

export const action = async ({ request, params: { clubId, teamId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');

  await requireClubAdmin(request, clubId);

  const formData = await request.formData();
  const validation = teamSchema.safeParse(Object.fromEntries(formData));
  if (!validation.success) return json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });

  const { name, description } = validation.data;
  const team = await updateTeam(teamId, name, description);

  return redirect(`/clubs/${clubId}/teams/${team.id}`);
};

export default function EditTeam() {
  const { team } = useOutletContext<TeamContextType>();

  return (
    <section className={'flex flex-col items-center py-4'}>
      <h2 className={'text-2xl'}>Edit Team</h2>
      <TeamForm defaultTeam={team} />
    </section>
  );
}
