import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubAdmin, requireClubUser } from '~/session.server';
import { createTeamMembers, getTeamUsersByTeamId } from '~/models/team.server';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import React from 'react';
import ResourceContextMenu, { EditLink } from '~/components/nav/resource-context-menu';
import AddMembersModal from '~/routes/clubs.$clubId.teams.$teamId.members/add-members-modal';
import DeleteResourceModal from '~/components/delete/delete-resource-modal';
import { errorFlash, useClubUserRoles } from '~/loader-utils';
import { getGravatarUrl } from '~/misc-utils';
import { IoIosRemoveCircleOutline } from 'react-icons/io';
import { TeamRole } from '.prisma/client';
import type { TeamRole as TeamRoleType } from '@prisma/client';

type TeamUser = {
  teamUserId: string;
  teamRoles: TeamRole[];
  clubUserId: string;
  userId: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  createdAt: string;
  isSelected: boolean;
};
export const loader = async ({ request, params: { clubId, teamId } }: LoaderArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');

  await requireClubUser(request, clubId);
  const teamUsers: TeamUser[] = (await getTeamUsersByTeamId(teamId)).map(teamUser => {
    const { id, name, email, imageUrl } = teamUser.clubUser.user;

    return {
      teamUserId: teamUser.id,
      teamRoles: teamUser.teamRoles,
      clubUserId: teamUser.clubUser.id,
      userId: id,
      name,
      email,
      imageUrl,
      createdAt: teamUser.createdAt.toString(),
      isSelected: false
    };
  });

  return json({ teamUsers });
};

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

// TODO: Use Zod instead of manual type guarding
function isTeamRole(value: any): value is TeamRoleType {
  return Object.values(TeamRole).includes(value);
}
function isMemberDto(data: any): data is MemberDto {
  return typeof data.clubUserId === 'string' && typeof data.teamRole === 'string' && isTeamRole(data.teamRole);
}

function isMemberDtoArray(data: any[]): data is MemberDto[] {
  return data.every(item => isMemberDto(item));
}

export default function TeamMembers() {
  const { clubId, teamId } = useParams();
  const clubUserRoles = useClubUserRoles();
  const { teamUsers: serverUsers } = useLoaderData<{ teamUsers: TeamUser[] }>();

  const [allSelected, setAllSelected] = React.useState<boolean>(false);
  const [teamUsers, setTeamUsers] = React.useState<TeamUser[]>(serverUsers);

  React.useEffect(() => setTeamUsers(serverUsers), [serverUsers]);

  const clubUserIds: string[] = React.useMemo(() => teamUsers.map(({ clubUserId }) => clubUserId), [teamUsers]);

  const handleAllSelected = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newState: TeamUser[] = teamUsers.map(teamUser => ({ ...teamUser, isSelected: event.target.checked }));
      setTeamUsers(newState);
      setAllSelected(event.target.checked);
    },
    [teamUsers]
  );

  const handleSelect = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, teamUserId: string) => {
      const newState = teamUsers.map(teamUser => {
        if (teamUser.teamUserId === teamUserId) {
          return { ...teamUser, isSelected: event.target.checked };
        }
        return teamUser;
      });
      setTeamUsers(newState);
      setAllSelected(false);
    },
    [teamUsers]
  );

  const contextMenu = (
    <ResourceContextMenu backButton>
      {clubUserRoles.isAdmin && (
        <React.Fragment>
          <EditLink to={`/clubs/${clubId}/teams/${teamId}/edit`} />
          <AddMembersModal postAction={`/clubs/${clubId}/teams/${teamId}/members`} existingClubUserIds={clubUserIds} />
          {/*//TODO move this to club team management instead*/}
          <DeleteResourceModal action={`/clubs/${clubId}/teams/${teamId}/delete`} message={'Are you sure you want to delete this team?'} />
        </React.Fragment>
      )}
    </ResourceContextMenu>
  );

  return (
    <React.Fragment>
      {contextMenu}
      <main className={'py-4'}>
        <div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  {clubUserRoles.isAdmin && (
                    <th>
                      <label>
                        <input checked={allSelected} onChange={handleAllSelected} type="checkbox" className="checkbox" />
                      </label>
                    </th>
                  )}
                  <th>Name</th>
                  <th>Role</th>
                  <th>Join date</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {teamUsers.map(({ teamUserId, teamRoles, userId, name, email, imageUrl, createdAt, isSelected }) => (
                  <tr key={teamUserId}>
                    {clubUserRoles.isAdmin && (
                      <th>
                        <label>
                          <input type="checkbox" checked={isSelected} onChange={e => handleSelect(e, teamUserId)} className="checkbox" />
                        </label>
                      </th>
                    )}
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img src={imageUrl ? imageUrl : getGravatarUrl(email)} alt="User" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{name}</div>
                          <div className="text-sm opacity-50">City</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {teamRoles.map(role => (
                        <span key={`${role}-${teamUserId}`} className="badge badge-ghost badge-sm">
                          {role}
                        </span>
                      ))}
                    </td>
                    <td>{new Date(createdAt).toDateString()}</td>
                    <th>
                      <Link to={`/clubs/${clubId}/users/${userId}`} key={`link-${teamUserId}`} className={'btn btn-ghost btn-xs'}>
                        Details
                      </Link>
                    </th>
                    <th>
                      <button className={'btn btn-ghost'}>
                        <IoIosRemoveCircleOutline />
                      </button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}
