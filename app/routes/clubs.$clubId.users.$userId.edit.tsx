import { errorFlash, useClubUser, useClubUserRoles } from '~/loader-utils';
import { Form, useActionData } from '@remix-run/react';
import DropDown from '~/components/form/dropdown';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { requireClubAdmin } from '~/session.server';
import invariant from 'tiny-invariant';
import { updateClubUser } from '~/models/club-user.server';
import useCustomToast from '~/hooks/useCustomToast';
import type { ClubRole } from '@prisma/client';
import { ClubRole as ClubRoles } from '@prisma/client';
import { useMemo } from 'react';
import Email from '~/components/misc/email';

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

  return redirect(`/clubs/${clubId}/users/${userId}`, 303);
};

/**
 * This contrived logic ensures that only an owner can change the roles of a user to an owner,
 * and only an owner con demote an owner.
 */
export default function EditClubUser() {
  const clubUser = useClubUser();
  const actionData = useActionData<typeof action>();
  const roles = useClubUserRoles();
  useCustomToast(actionData?.flash);

  const selectableRoles = useMemo(() => {
    if (roles.isOwner) return Object.values(ClubRoles);
    return Object.values(ClubRoles).filter(role => role !== ClubRoles.CLUB_OWNER);
  }, [roles]);

  const resourceIsOwner = useMemo(() => clubUser.clubRoles.includes(ClubRoles.CLUB_OWNER), [clubUser]);

  return (
    <Form method={'post'} className={'mx-auto mt-2 flex max-w-md flex-col gap-2'}>
      <div className={'text-2xl'}>{clubUser.user.name}</div>
      {/*TODO this should be in the 'showUser' component, not here*/}
      <Email email={clubUser.user.email} />
      {resourceIsOwner && !roles.isOwner ? (
        <div>Only owners can edit owner roles</div>
      ) : (
        <>
          <input hidden name={CLUB_USER_ID} readOnly value={clubUser.id} />
          <DropDown defaultValue={clubUser.clubRoles[0]} options={selectableRoles} name={ROLE} id={ROLE} label={'Role'} errors={null} />
          <button className={'btn btn-primary'}>Save</button>{' '}
        </>
      )}
    </Form>
  );
}
