import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { requireUserId } from '~/session.server';

export const loader = async ({ request, params }: LoaderArgs) => {
  await requireUserId(request);
  return redirect('/dashboard');
};
