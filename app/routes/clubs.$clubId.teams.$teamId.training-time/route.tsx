import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireTeamLeader } from '~/session.server';
import { nativeEnum, string, z } from 'zod';
import { $Enums } from '.prisma/client';
import { createTrainingTime, deleteTrainingTimeById } from '~/models/training-time.server';
import { errorFlash } from '~/loader-utils';
import { getMessageOrDefault } from '~/misc-utils';
import type { Flash } from '~/hooks/useCustomToast';
import WeekDay = $Enums.WeekDay;

const trainingTimeSchema = z.object({
  trainingTimeId: string().optional(),
  weekDay: nativeEnum(WeekDay),
  startTime: string().length(5),
  endTime: string().length(5),
  location: string().min(2).max(30).trim()
});

export type TrainingTimeFetcherData = {
  errors?: { weekDay?: string[]; startTime?: string[]; endTime?: string[]; location?: string[] };
  flash?: Flash;
  ok?: true;
};

export const action = async ({ request, params: { clubId, teamId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing from route');
  invariant(teamId, 'teamId missing from route');
  await requireTeamLeader(request, clubId, teamId);

  switch (request.method) {
    case 'POST':
      return post(request, teamId);
    case 'PATCH':
      return patch(request, teamId);
    case 'DELETE':
      return remove(request, teamId);

    default:
      throw new Error('route not implemented');
  }
};

async function post(request: Request, teamId: string) {
  const formData = await request.formData();
  const validation = trainingTimeSchema.safeParse(Object.fromEntries(formData));

  if (!validation.success) {
    return json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { weekDay, startTime, endTime, location } = validation.data;

  if (getDate(startTime) >= getDate(endTime)) {
    return json({ flash: errorFlash('Start time must come before end time') }, { status: 400 });
  }

  try {
    await createTrainingTime(weekDay, startTime, endTime, location, teamId);
    return json({ ok: true });
  } catch (e) {
    return json({ flash: errorFlash(getMessageOrDefault(e, 'Create failed')) }, { status: 500 });
  }
}

async function patch(request: Request, teamId: string) {
  console.log('Hello');
  return json({ ok: true });
}

async function remove(request: Request, teamId: string) {
  const formData = await request.formData();
  const trainingTimeId = formData.get('trainingTimeId');

  if (typeof trainingTimeId !== 'string') {
    return json({ flash: errorFlash('Delete failed') }, { status: 500 });
  }

  try {
    await deleteTrainingTimeById(trainingTimeId);
    return json({ ok: true });
  } catch (e) {
    return json({ flash: errorFlash(getMessageOrDefault(e, 'Delete failed')) }, { status: 500 });
  }
}

function getDate(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number);

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}
