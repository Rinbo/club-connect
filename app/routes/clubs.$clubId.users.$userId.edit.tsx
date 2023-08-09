import { errorFlash, useClubUser, useClubUserRoles } from '~/loader-utils';
import { Form, useActionData, useNavigate } from '@remix-run/react';
import DropDown from '~/components/form/dropdown';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { requireClubAdmin } from '~/session.server';
import invariant from 'tiny-invariant';
import { updateClubUser } from '~/models/club-user.server';
import useCustomToast from '~/hooks/useCustomToast';
import type { ClubRole } from '@prisma/client';
import { ClubRole as ClubRoles } from '@prisma/client';
import React, { useMemo } from 'react';
import UserDisplay from '~/components/user/user-display';
import TextInput from '~/components/form/text-input';

const CLUB_USER_ID = 'clubUserId';
const ROLE = 'role';

// TODO implement address
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

/**
 * This contrived logic ensures that only an owner can change the roles of a user to an owner,
 * and only an owner con demote an owner.
 */
export default function EditClubUser() {
  const clubUser = useClubUser();
  const actionData = useActionData<typeof action>();
  const principalRoles = useClubUserRoles();
  const navigate = useNavigate();

  useCustomToast(actionData?.flash);

  const selectableRoles = useMemo(() => {
    if (principalRoles.isOwner) return Object.values(ClubRoles);
    return Object.values(ClubRoles).filter(role => role !== ClubRoles.CLUB_OWNER);
  }, [principalRoles]);

  const resourceIsOwner = useMemo(() => clubUser.clubRoles.includes(ClubRoles.CLUB_OWNER), [clubUser]);

  return (
    <UserDisplay user={clubUser.user}>
      <Form method={'post'} className={'mx-auto mt-2 flex max-w-md flex-col gap-2'}>
        <input hidden name={CLUB_USER_ID} readOnly value={clubUser.id} />
        <TextInput label={'Phone Number'} defaultValue={'+46 555 555 55'} />
        <TextInput label={'Address'} defaultValue={'Generic Street 17'} />
        {resourceIsOwner && !principalRoles.isOwner ? (
          <div>Only owners can edit owner roles</div>
        ) : (
          <DropDown
            defaultValue={clubUser.clubRoles[0]}
            options={selectableRoles}
            name={ROLE}
            id={ROLE}
            label={'Club Role'}
            errors={null}
          />
        )}
        <div className={'mt-2 flex justify-between'}>
          <button type={'button'} className={'btn'} onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type={'submit'} className={'btn btn-primary'}>
            Save
          </button>
        </div>
      </Form>
    </UserDisplay>
  );
}
