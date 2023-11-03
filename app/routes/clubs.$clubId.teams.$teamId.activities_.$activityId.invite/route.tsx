import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireTeamWebmaster } from '~/session.server';
import { errorFlash } from '~/loader-utils';
import { getTeamUsersByTeamId } from '~/models/team.server';
import { NotificationStatus } from '@prisma/client';
import { sendEmailInvites } from '~/jobs/team-activity.server';
import { updateNotificationStatus } from '~/models/team-activity.server';
import { PARTICIPANT_ROLES } from '~/routes/clubs.$clubId.teams.$teamId.activities_.$activityId._index/route';

export const action = async ({ request, params: { clubId, teamId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing form route');
  invariant(teamId, 'teamId missing form route');
  await requireTeamWebmaster(request, clubId, teamId);

  const formData = await request.formData();
  const activityId = formData.get('activityId');

  if (typeof activityId !== 'string') {
    return json({ flash: errorFlash('Failed to send email invites') }, { status: 500 });
  }

  const teamUsers = await getTeamUsersByTeamId(teamId);
  const jobs = await Promise.allSettled(
    teamUsers
      .filter(teamUser => teamUser.teamRoles.some(role => PARTICIPANT_ROLES.includes(role)))
      .map(teamUser => teamUser.clubUser)
      .map(async clubUser => await sendEmailInvites({ email: clubUser.user.email, activityId }))
  );

  const allAdded = jobs.every(job => (job.status = 'fulfilled'));

  if (allAdded) await updateNotificationStatus(activityId, NotificationStatus.SENT);

  return json({ ok: allAdded });
};
