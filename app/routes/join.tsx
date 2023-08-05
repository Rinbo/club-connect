import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import { createUser, getUserByEmail } from '~/models/user.server';
import { createUserSession, getUserId } from '~/session.server';
import { safeRedirect } from '~/loader-utils';
import { string, z } from 'zod';
import TextInput from '~/components/form/text-input';
import AppLogo from '~/components/logo';

const signupSchema = z.object({
  name: string().min(3).max(50),
  email: string().email().trim().toLowerCase(),
  password: string().min(6).max(50)
});

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/dashboard');

  const validation = signupSchema.safeParse(Object.fromEntries(formData));

  if (!validation.success) {
    return json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { email, password, name } = validation.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: ['A user already exists with this email'],
          password: null,
          name: null
        }
      },
      { status: 400 }
    );
  }

  const user = await createUser(email, password, name);

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    user
  });
};

export const meta: V2_MetaFunction = () => [{ title: 'Sign Up' }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? undefined;
  const actionData = useActionData<typeof action>();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <Link to={'/'}>
        <div className={'mb-16 flex items-center justify-center'}>
          <AppLogo />
          <div className={'font-mono text-2xl text-base-content'}>Club Connect</div>
        </div>
      </Link>
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <TextInput
            label={'Name'}
            id={'name'}
            name={'name'}
            placeholder={'Bob Bobson'}
            errors={actionData?.errors?.name}
            reactRef={nameRef}
          />
          <TextInput
            label={'Email'}
            id={'email'}
            name={'email'}
            errors={actionData?.errors?.email}
            autoComplete={'email'}
            type={'email'}
            placeholder={'bob@example.com'}
            reactRef={emailRef}
          />
          <TextInput
            label={'Password'}
            id={'password'}
            name={'password'}
            type={'password'}
            errors={actionData?.errors?.password}
            reactRef={passwordRef}
          />

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button type="submit" className="btn btn-primary w-full">
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                className="btn btn-link"
                to={{
                  pathname: '/login',
                  search: searchParams.toString()
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
