import { Form, useActionData, useNavigate } from '@remix-run/react';
import TextInput from '~/components/form/text-input';
import { object, string } from 'zod';
import type { ClientTeam } from '~/routes/clubs.$clubId.teams.$teamId/route';

export type TeamFormActionData = {
  errors?: { name?: string[]; description?: string[] };
};

export const teamSchema = object({
  name: string().min(2).max(30).trim(),
  description: string().min(2).max(255)
});

export default function TeamForm({ defaultTeam }: { defaultTeam?: ClientTeam | null }) {
  const navigate = useNavigate();
  const actionData = useActionData<TeamFormActionData>();

  return (
    <Form method={'post'} className={'flex w-full max-w-screen-sm flex-col gap-2'}>
      <TextInput
        label={'Name'}
        name={'name'}
        id={'name'}
        type={'text'}
        placeholder={'Team name'}
        defaultValue={defaultTeam?.name}
        errors={actionData?.errors?.name}
      />
      <TextInput
        label={'Description'}
        name={'description'}
        id={'description'}
        type={'text'}
        placeholder={'Description'}
        defaultValue={defaultTeam?.description}
        errors={actionData?.errors?.description}
      />
      <div className={'flex justify-end gap-2'}>
        <button onClick={() => navigate(-1)} type={'button'} className={'btn'}>
          Cancel
        </button>
        <button type={'submit'} className={'btn btn-primary'}>
          Save
        </button>
      </div>
    </Form>
  );
}
