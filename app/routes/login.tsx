import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import { verifyLogin } from '~/models/user.server';
import { createUserSession, redirectIfSignedIn } from '~/session.server';
import { safeRedirect } from '~/loader-utils';
import { string, z } from 'zod';
import TextInput from '~/components/form/text-input';
import CheckBox from '~/components/form/checkbox';
import AppLogo from '~/components/logo';

const loginSchema = z.object({
  email: string().email().trim().toLowerCase(),
  password: string().min(6).max(60)
});

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfSignedIn(request);
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const validation = loginSchema.safeParse(Object.fromEntries(formData));

  if (!validation.success) return json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });

  const { email, password } = validation.data;

  const user = await verifyLogin(email, password);

  if (!user) {
    return json({ errors: { email: ['Invalid email or password'], password: null } }, { status: 400 });
  }

  return createUserSession({
    redirectTo: safeRedirect(formData.get('redirectTo'), '/'),
    remember: formData.get('remember') === 'on',
    request,
    user
  });
};

export const meta: V2_MetaFunction = () => [{ title: 'Login' }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
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
            Log in
          </button>
          <div className="flex items-center justify-between">
            <CheckBox label={'Remember me'} id={'remember'} name={'remember'} />
            <div className="text-center text-sm text-base-content">
              Don't have an account?{' '}
              <Link
                className="btn btn-link"
                to={{
                  pathname: '/join',
                  search: searchParams.toString()
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
