import DropDown from '~/components/form/dropdown';
import TextInput from '~/components/form/text-input';
import DateInput from '~/components/form/date-input';
import TextArea from '~/components/form/text-area';
import { Form, useActionData, useNavigate } from '@remix-run/react';
import { $Enums } from '.prisma/client';
import type { Flash } from '~/hooks/useCustomToast';
import useCustomToast from '~/hooks/useCustomToast';
import { nativeEnum, string, z } from 'zod';
import type { ClientTeamActivity } from '~/routes/clubs.$clubId.teams.$teamId.activities/route';
import { json } from '@remix-run/node';
import { errorFlash } from '~/loader-utils';
import TeamActivityType = $Enums.TeamActivityType;

export const teamActivitySchema = z.object({
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

type Props = { defaultValues?: ClientTeamActivity };

export async function teamActivityFormValidation(request: Request) {
  const formData = await request.formData();
  const validation = teamActivitySchema.safeParse(Object.fromEntries(formData));

  if (!validation.success) {
    return { error: json({ errors: validation.error.flatten().fieldErrors, flash: errorFlash('Validation failed') }, { status: 400 }) };
  }

  if (validation.data.startTime > validation.data.endTime) {
    return {
      error: json(
        { errors: { startTime: ['Must come before end time'] }, flash: errorFlash('Start time must come before end time') },
        { status: 400 }
      )
    };
  }

  return { data: validation.data };
}

export default function TeamActivityForm({ defaultValues }: Props) {
  const navigate = useNavigate();
  const actionData = useActionData<ActionData>();

  useCustomToast(actionData?.flash);

  return (
    <Form replace method={'post'} className={'flex w-full max-w-xl flex-col gap-2'}>
      <DropDown options={Object.values(TeamActivityType)} name={'type'} id={'type'} defaultValue={defaultValues?.type} />
      <TextInput
        name={'location'}
        id={'location'}
        label={'Location'}
        errors={actionData?.errors?.location}
        defaultValue={defaultValues?.location}
      />
      <div className={'flex flex-wrap gap-2'}>
        <DateInput
          name={'startTime'}
          id={'startTime'}
          label={'Start time'}
          errors={actionData?.errors?.startTime}
          defaultValue={defaultValues?.startTime}
        />
        <DateInput
          name={'endTime'}
          id={'endTime'}
          label={'End time'}
          errors={actionData?.errors?.endTime}
          defaultValue={defaultValues?.endTime}
        />
      </div>
      <TextArea
        name={'description'}
        id={'description'}
        label={'Information'}
        placeholder={'Write something...'}
        rowNum={5}
        required={false}
        defaultValue={defaultValues?.description ?? undefined}
      />
      <div className={'mt-2 flex justify-between'}>
        <button type={'button'} className={'btn'} onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button className={'btn btn-primary'} type={'submit'}>
          Save
        </button>
      </div>
    </Form>
  );
}
