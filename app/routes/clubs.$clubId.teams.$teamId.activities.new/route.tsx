import { Form, useActionData, useNavigate } from '@remix-run/react';
import TextInput from '~/components/form/text-input';
import TextArea from '~/components/form/text-area';
import DateInput from '~/components/form/date-input';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireTeamLeader } from '~/session.server';
import { nativeEnum, string, z } from 'zod';
import DropDown from '~/components/form/dropdown';
import { $Enums } from '.prisma/client';
import type { Flash } from '~/hooks/useCustomToast';
import useCustomToast from '~/hooks/useCustomToast';
import { createTeamActivity } from '~/models/team-activity.server';
import { errorFlash } from '~/loader-utils';
import { getMessageOrDefault } from '~/misc-utils';
import TeamActivityType = $Enums.TeamActivityType;

const teamActivitySchema = z.object({
  type: nativeEnum(TeamActivityType),
  location: string().min(2).trim(),
  description: string().optional(),
  startTime: string().pipe(z.coerce.date()),
  endTime: string().pipe(z.coerce.date())
});

type ActionData = {
  errors?: { title?: string[]; location?: string[]; description?: string[]; startTime?: string[]; endTime?: string[] };
  flash?: Flash;
};

export const action = async ({ request, params: { clubId, teamId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');
  await requireTeamLeader(request, clubId, teamId);

  const formData = await request.formData();
  const validation = teamActivitySchema.safeParse(Object.fromEntries(formData));

  if (!validation.success) {
    return json({ errors: validation.error.flatten().fieldErrors, flash: errorFlash('Validation failed') }, { status: 400 });
  }

  if (validation.data.startTime > validation.data.endTime) {
    return json(
      { errors: { startTime: ['Must come before end time'] }, flash: errorFlash('Start time must come before end time') },
      { status: 400 }
    );
  }

  try {
    const teamActivity = await createTeamActivity(teamId, validation.data);
    return redirect(`/clubs/${clubId}/teams/${teamId}/activities/${teamActivity.id}`);
  } catch (e) {
    return json({ flash: errorFlash(getMessageOrDefault(e, 'Failed to create training activity')) }, { status: 500 });
  }
};

export default function CreateActivity() {
  const navigate = useNavigate();
  const actionData = useActionData<ActionData>();

  useCustomToast(actionData?.flash);

  return (
    <section className={'flex justify-center py-4'}>
      <Form replace method={'post'} className={'flex w-full max-w-xl flex-col gap-2'}>
        <DropDown options={Object.values(TeamActivityType)} name={'type'} id={'type'} />
        <TextInput name={'location'} id={'location'} label={'Location'} errors={actionData?.errors?.location} />
        <div className={'flex flex-wrap gap-2'}>
          <DateInput name={'startTime'} id={'startTime'} label={'Start time'} errors={actionData?.errors?.startTime} />
          <DateInput name={'endTime'} id={'endTime'} label={'End time'} errors={actionData?.errors?.endTime} />
        </div>
        <TextArea name={'description'} id={'description'} label={'Information'} placeholder={'Write something...'} rowNum={5} />
        <div className={'mt-2 flex justify-between'}>
          <button type={'button'} className={'btn'} onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className={'btn btn-primary'} type={'submit'}>
            Submit
          </button>
        </div>
      </Form>
    </section>
  );
}
