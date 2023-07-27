import { errorFlash, useClubUser } from '~/loader-utils';
import { Form, useActionData } from '@remix-run/react';
import DropDown from '~/components/form/dropdown';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { requireClubAdmin } from '~/session.server';
import invariant from 'tiny-invariant';
import { updateClubUser } from '~/models/club-user.server';
import useCustomToast from '~/hooks/useCustomToast';
import type { ClubRole } from '@prisma/client';
import { ClubRole as Roles } from '@prisma/client';

const CLUB_USER_ID = 'clubUserId';
const ROLE = 'role';
export const action = async ({ request, params: { userId, clubId } }: ActionArgs) => {
  invariant(clubId, 'invalid clubId');
  invariant(userId, 'invalid userId');
  await requireClubAdmin(request, clubId);
  const formData = await request.formData();
  const role = formData.get(ROLE);
  const clubUserId = formData.get(CLUB_USER_ID);

  if (typeof clubUserId !== 'string' || typeof role !== 'string') {
    throw new Error('Failed to parse form data');
  }

  try {
    await updateClubUser(clubUserId, [role as ClubRole]);
  } catch (e) {
    return json({ flash: errorFlash('Update failed') }, { status: 500 });
  }

  return redirect(`/clubs/${clubId}/users/${userId}`);
};
export default function EditClubUser() {
  const clubUser = useClubUser();
  const actionData = useActionData<typeof action>();
  useCustomToast(actionData?.flash);

  return (
    <Form method={'post'} className={'mx-auto flex max-w-md flex-col gap-2'}>
      <div>{clubUser.user.name}</div>
      <div>{clubUser.user.email}</div>
      <input hidden name={CLUB_USER_ID} readOnly value={clubUser.id} />
      <DropDown defaultValue={clubUser.clubRoles[0]} options={Object.values(Roles)} name={ROLE} id={ROLE} label={'Role'} errors={null} />
      <button className={'btn btn-primary'}>Save</button>
    </Form>
  );
}
