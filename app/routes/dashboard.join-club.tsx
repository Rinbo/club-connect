import { Form, useActionData, useFetcher } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { findClubByNameContains } from '~/models/club.server';
import { requireUserId } from '~/session.server';
import { errorFlash, useClubs } from '~/loader-utils';
import { createClubUser } from '~/models/club-user.server';
import useCustomToast from '~/hooks/useCustomToast';

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  const url = new URL(request.url);
  const clubQuery = url.searchParams.get('club-query');
  if (!clubQuery) return json({ clubs: [] });

  return json({ clubs: await findClubByNameContains(clubQuery) });
};

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const clubId = formData.get('clubId');

  if (typeof clubId !== 'string') {
    return json({ flash: errorFlash('clubId is invalid') }, { status: 500 });
  }

  try {
    await createClubUser(clubId, userId);
  } catch (e) {
    return json({ flash: errorFlash('Unable to join club. Try again later') }, { status: 500 });
  }

  return redirect(`/clubs/${clubId}`);
};

export default function JoinClub() {
  const fetcher = useFetcher<typeof loader>();
  const userClubIds = useClubs().map(club => club.id);
  const actionData = useActionData<typeof action>();

  useCustomToast(actionData?.flash);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    fetcher.submit(e.target.form);
  }

  return (
    <div className={'mx-auto max-w-md p-4'}>
      <h1 className={'mb-4 text-2xl uppercase'}>Join a club</h1>
      <fetcher.Form method="get" action={'/dashboard/join-club'}>
        <input
          onChange={handleInputChange}
          type={'text'}
          name="club-query"
          className={'input input-info my-2 w-full'}
          placeholder={'Search for a club'}
        />
      </fetcher.Form>

      {fetcher.state === 'submitting'
        ? 'Searching...'
        : fetcher.data &&
          fetcher.data.clubs.length > 0 && (
            <div className={'flex flex-col gap-y-4 rounded-xl border p-2'}>
              {fetcher.data.clubs.map(({ name, id }) => (
                <Form method={'post'} key={id} className={'flex items-center justify-between'}>
                  <div>{name}</div>
                  <input name="clubId" value={id} readOnly hidden />
                  <button disabled={userClubIds.includes(id)} className={'btn btn-primary btn-sm'} type="submit">
                    Join
                  </button>
                </Form>
              ))}
            </div>
          )}
    </div>
  );
}
