import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubAdmin } from '~/session.server';
import { nativeEnum, string, z } from 'zod';
import type { TeamRole } from '.prisma/client';
import { $Enums } from '.prisma/client';
import { errorFlash } from '~/loader-utils';
import { updateTeamUserRole } from '~/models/team.server';

const teamRoleSchema = z.object({
  teamUserId: string().nonempty(),
  teamRole: nativeEnum($Enums.TeamRole)
});

const error = json({ flash: errorFlash('Edit roles failed') }, { status: 500 });

export const action = async ({ request, params: { clubId, teamId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing from route');
  invariant(teamId, 'teamId missing from route');
  await requireClubAdmin(request, clubId);

  const formData = await request.formData();
  const validation = teamRoleSchema.safeParse(Object.fromEntries(formData));

  if (!validation.success) {
    console.log(validation.error.flatten().fieldErrors, 'FIELDS');
    return error;
  }

  try {
    const { teamUserId, teamRole } = validation.data;
    await updateTeamUserRole(teamUserId, teamId, teamRole as TeamRole);
  } catch (err) {
    console.error(err);
    return error;
  }

  return json({ ok: true });
};
