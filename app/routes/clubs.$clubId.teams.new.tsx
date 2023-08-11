import { Form, useActionData, useNavigate } from '@remix-run/react';
import TextInput from '~/components/form/text-input';
import { object, string } from 'zod';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubAdmin } from '~/session.server';
import { createTeam } from '~/models/team.server';

type ActionData = {
  errors?: { name?: string[] };
};

const teamSchema = object({
  name: string().min(2).max(30).trim()
});

export const action = async ({ request, params: { clubId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  await requireClubAdmin(request, clubId);

  const formData = await request.formData();
  const validation = teamSchema.safeParse(Object.fromEntries(formData));
  if (!validation.success) return json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });

  const team = await createTeam(validation.data.name, clubId);

  return redirect(`/clubs/${clubId}/teams/${team.id}`);
};

export default function CreateTeam() {
  const navigate = useNavigate();
  const actionData = useActionData<ActionData>();

  return (
    <section className={'flex justify-center py-4'}>
      <Form method={'post'} className={'flex w-full max-w-screen-sm flex-col gap-2'}>
        <TextInput label={'Name'} name={'name'} id={'name'} type={'text'} placeholder={'Team name'} errors={actionData?.errors?.name} />
        <div className={'flex justify-end gap-2'}>
          <button onClick={() => navigate(-1)} type={'button'} className={'btn'}>
            Cancel
          </button>
          <button type={'submit'} className={'btn btn-primary'}>
            Save
          </button>
        </div>
      </Form>
    </section>
  );
}
