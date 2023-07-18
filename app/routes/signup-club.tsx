import { Form, useActionData } from '@remix-run/react';
import FieldInput from '~/components/form/field-input';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { object, string } from 'zod';
import { createOwner, getUserByEmail } from '~/models/user.server';
import { createUserSession, redirectIfSignedIn } from '~/session.server';
import { findClubByName } from '~/models/club.server';
import Divider from '~/components/misc/divider';
import DropDown from '~/components/form/dropdown';

const clubCreateSchema = object({
  name: string().min(2).max(60).trim(),
  email: string().email().trim().toLowerCase(),
  password: string().min(6).max(60).trim(),
  clubName: string().min(6).trim(),
  clubType: string().nonempty({ message: 'Please select a type' })
});

const nullErrors = {
  name: null,
  email: null,
  password: null,
  clubName: null,
  clubType: null
};

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfSignedIn(request);
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const validation = clubCreateSchema.safeParse(Object.fromEntries(formData));

  if (!validation.success) {
    return json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { email, name, password, clubName, clubType } = validation.data;

  if (await getUserByEmail(email)) {
    return json({ errors: { ...nullErrors, email: ['User already exists'] } }, { status: 409 });
  }

  if (await findClubByName(clubName)) {
    return json({ errors: { ...nullErrors, clubName: ['Club name already exists'] } }, { status: 409 });
  }

  const owner = await createOwner(name, email, password, clubName, clubType);
  const clubUser = owner.clubUsers.find(clubUser => clubUser.userId === owner.id);

  return createUserSession({
    redirectTo: `/clubs/${clubUser?.clubId || '/dashboard'}`,
    remember: false,
    request,
    user: owner
  });
};

export default function CreateClub() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <Divider text={'User information'} />
          <FieldInput label={'Name'} id={'name'} name={'name'} errors={actionData?.errors?.name} />
          <FieldInput
            label={'Email'}
            id={'email'}
            name={'email'}
            errors={actionData?.errors?.email}
            autoComplete={'email'}
            type={'email'}
            placeholder={'bob@example.com'}
          />
          <FieldInput label={'Password'} id={'password'} name={'password'} type={'password'} errors={actionData?.errors?.password} />
          <Divider text={'Club details'} />
          <FieldInput label={'Club Name'} id={'clubName'} name={'clubName'} errors={actionData?.errors?.clubName} />
          <DropDown
            options={['SPORT', 'MUSIC', 'OTHER']}
            name={'clubType'}
            id={'clubType'}
            label={'Club Type'}
            errors={actionData?.errors?.clubType}
          />
          <button type={'submit'} className="w-full rounded bg-indigo-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
}
