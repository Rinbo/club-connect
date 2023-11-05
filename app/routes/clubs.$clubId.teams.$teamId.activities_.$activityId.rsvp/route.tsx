import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireTeamUser } from '~/session.server';
import { z } from 'zod';
import { Intent } from '@prisma/client';
import { updateTeamActivityIntent } from '~/models/team-activity.server';
import { errorFlash, successFlash } from '~/loader-utils';
import { getMessageOrDefault } from '~/misc-utils';

export const PRINCIPAL_ID = 'principalId';
export const RSVP_INTENT = 'rsvpIntent';

const FAIL_MESSAGE = 'Failed to save intent';

const rsvpSchema = z.object({
  principalId: z.string(),
  rsvpIntent: z.nativeEnum(Intent)
});

export const action = async ({ request, params: { activityId, clubId, teamId } }: ActionArgs) => {
  console.log('entry');
  invariant(activityId, 'activityId missing in route');
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');
  await requireTeamUser(request, clubId, teamId);
  console.log('entry 1');
  const formData = await request.formData();
  const validation = rsvpSchema.safeParse(Object.fromEntries(formData));

  console.log('entry 2');

  if (!validation.success) return json({ flash: errorFlash('Invalid RSVP type') }, { status: 500 });

  const { principalId, rsvpIntent } = validation.data;

  console.log('entry 3');

  try {
    await updateTeamActivityIntent(principalId, activityId, rsvpIntent);
    console.log('entry 4');
    return json({ flash: successFlash('RSVP status saved') }, { status: 200 });
  } catch (error) {
    return json({ flash: errorFlash(getMessageOrDefault(error, FAIL_MESSAGE)) }, { status: 500 });
  }
};
