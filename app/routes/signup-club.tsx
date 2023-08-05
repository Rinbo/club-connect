import { Form, Link, useActionData } from '@remix-run/react';
import TextInput from '~/components/form/text-input';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { object, string } from 'zod';
import { createOwner, getUserByEmail } from '~/models/user.server';
import { createUserSession, redirectIfSignedIn } from '~/session.server';
import { findClubByName } from '~/models/club.server';
import DropDown from '~/components/form/dropdown';
import useCustomToast from '~/hooks/useCustomToast';
import { errorFlash } from '~/loader-utils';
import AppLogo from '~/components/logo';

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

function resourceExists(field: string, message: string) {
  return json(
    {
      errors: { ...nullErrors, [field]: [message] },
      flash: errorFlash(message)
    },
    { status: 409 }
  );
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const validation = clubCreateSchema.safeParse(Object.fromEntries(formData));

  if (!validation.success) {
    return json({ errors: validation.error.flatten().fieldErrors, flash: errorFlash('Form is invalid') }, { status: 400 });
  }

  const { email, name, password, clubName, clubType } = validation.data;

  if (await getUserByEmail(email)) {
    return resourceExists('email', 'User already exists');
  }

  if (await findClubByName(clubName)) {
    return resourceExists('clubName', 'Club name already exists');
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
  useCustomToast(actionData?.flash);

  return (
    <div className="flex min-h-full flex-col justify-center py-6">
      <Link to={'/'}>
        <div className={'mb-4 flex items-center justify-center sm:mb-16'}>
          <AppLogo />
          <div className={'font-mono text-2xl text-base-content'}>Club Connect</div>
        </div>
      </Link>
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div className={'divider'}>User Information</div>
          <TextInput label={'Name'} id={'name'} name={'name'} errors={actionData?.errors?.name} />
          <TextInput
            label={'Email'}
            id={'email'}
            name={'email'}
            errors={actionData?.errors?.email}
            autoComplete={'email'}
            type={'email'}
            placeholder={'bob@example.com'}
          />
          <TextInput label={'Password'} id={'password'} name={'password'} type={'password'} errors={actionData?.errors?.password} />
          <div className={'divider'}>Club Details</div>
          <TextInput label={'Club Name'} id={'clubName'} name={'clubName'} errors={actionData?.errors?.clubName} />
          <DropDown
            options={['SPORT', 'MUSIC', 'OTHER']}
            name={'clubType'}
            id={'clubType'}
            label={'Club Type'}
            errors={actionData?.errors?.clubType}
          />
          <button type={'submit'} className="btn btn-primary w-full">
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
}
