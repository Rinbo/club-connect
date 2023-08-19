import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { TeamRole as TeamRoleType } from '@prisma/client';
import { $Enums } from '@prisma/client';
import { errorFlash } from '~/loader-utils';
import invariant from 'tiny-invariant';
import { requireClubAdmin } from '~/session.server';
import { createTeamMembers } from '~/models/team.server';
import TeamRole = $Enums.TeamRole;

export type MemberDto = { clubUserId: string; teamRole: TeamRoleType };
export const FORM_DATA_KEY = 'members';
const ERROR_MESSAGE = 'Could not add member';

export const action = async ({ request, params: { clubId, teamId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');

  await requireClubAdmin(request, clubId);

  const formData = await request.formData();
  const formDataValue = formData.get(FORM_DATA_KEY);

  if (typeof formDataValue !== 'string') {
    return json({ flash: errorFlash(ERROR_MESSAGE) }, { status: 500 });
  }
  const members = JSON.parse(formDataValue);

  if (Array.isArray(members) && isMemberDtoArray(members)) {
    await createTeamMembers(members, teamId);
    return json({ ok: true });
  } else {
    return json({ flash: errorFlash(ERROR_MESSAGE) }, { status: 500 });
  }
};

function isTeamRole(value: any): value is TeamRoleType {
  return Object.values(TeamRole).includes(value);
}
function isMemberDto(data: any): data is MemberDto {
  return typeof data.clubUserId === 'string' && typeof data.teamRole === 'string' && isTeamRole(data.teamRole);
}

function isMemberDtoArray(data: any[]): data is MemberDto[] {
  return data.every(item => isMemberDto(item));
}
