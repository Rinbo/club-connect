import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubAdmin, requireClubUser } from '~/session.server';
import { createTeamMembers, deleteTeamMembers, getTeamUsersByTeamId } from '~/models/team.server';
import { Link, useFetcher, useLoaderData, useParams } from '@remix-run/react';
import React from 'react';
import ResourceContextMenu, { EditLink } from '~/components/nav/resource-context-menu';
import AddMembersModal from '~/routes/clubs.$clubId.teams.$teamId.members/add-members-modal';
import { errorFlash, useClubUserRoles } from '~/loader-utils';
import { getGravatarUrl } from '~/misc-utils';
import { TeamRole } from '.prisma/client';
import type { TeamRole as TeamRoleType } from '@prisma/client';
import ConfirmationModal from '~/components/modal/confirmation-modal';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoIosRemoveCircleOutline } from 'react-icons/io';

const ERROR_MESSAGE = 'Could not add member';

export type TeamMemberModel = { clubUserId: string; teamRole: TeamRoleType };
export const FORM_DATA_KEY = 'members';

const TeamRoleMap = {
  [TeamRole.TEAM_LEADER]: 'Leaders',
  [TeamRole.TEAM_PLAYER]: 'Players',
  [TeamRole.TEAM_WEBMASTER]: 'Webmasters',
  [TeamRole.TEAM_PARENT]: 'Parents'
};

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

export const action = async ({ request, params: { clubId, teamId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');
  await requireClubAdmin(request, clubId);

  const formData = await request.formData();
  const formDataValue = formData.get(FORM_DATA_KEY);

  if (typeof formDataValue !== 'string') {
    return json({ flash: errorFlash(ERROR_MESSAGE) }, { status: 500 });
  }

  switch (request.method) {
    case 'POST': {
      return await addMembers(formDataValue, teamId);
    }
    case 'DELETE': {
      return await removeMembers(formDataValue, teamId);
    }
  }
};

async function addMembers(formDataValue: string, teamId: string) {
  const members = JSON.parse(formDataValue);

  if (Array.isArray(members) && isMemberDtoArray(members)) {
    await createTeamMembers(members, teamId);
    return json({ ok: true });
  } else {
    return json({ flash: errorFlash(ERROR_MESSAGE) }, { status: 500 });
  }
}

async function removeMembers(formDataValue: string, teamId: string) {
  const memberIds: string[] = JSON.parse(formDataValue);
  await deleteTeamMembers(memberIds, teamId);
  return json({ ok: true });
}

function isTeamRole(value: any): value is TeamRoleType {
  return Object.values(TeamRole).includes(value);
}
function isMemberDto(data: any): data is TeamMemberModel {
  return typeof data.clubUserId === 'string' && typeof data.teamRole === 'string' && isTeamRole(data.teamRole);
}

function isMemberDtoArray(data: any[]): data is TeamMemberModel[] {
  return data.every(item => isMemberDto(item));
}

export default function TeamMembers() {
  const { clubId, teamId } = useParams();
  const fetcher = useFetcher();
  const clubUserRoles = useClubUserRoles();
  const { teamUsers: serverUsers } = useLoaderData<{ teamUsers: TeamUser[] }>();
  const action = `/clubs/${clubId}/teams/${teamId}/members`;

  const [allSelected, setAllSelected] = React.useState<boolean>(false);
  const [teamUsers, setTeamUsers] = React.useState<TeamUser[]>(serverUsers);

  React.useEffect(() => setTeamUsers(serverUsers), [serverUsers]);

  const nonSelected = React.useMemo(() => !teamUsers.some(u => u.isSelected), [teamUsers]);
  const clubUserIds: string[] = React.useMemo(() => teamUsers.map(({ clubUserId }) => clubUserId), [teamUsers]);

  const teamUserMap: Map<TeamRoleType, TeamUser[]> = React.useMemo(() => {
    const map: Map<TeamRoleType, TeamUser[]> = new Map();
    Object.values(TeamRole).forEach((role: TeamRoleType) => map.set(role, []));
    map.forEach((users, role) => {
      teamUsers.forEach(user => user.teamRoles.includes(role) && users.push(user));
    });
    return map;
  }, [teamUsers]);

  const handleAllSelected = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newState: TeamUser[] = teamUsers.map(teamUser => ({ ...teamUser, isSelected: event.target.checked }));
      setTeamUsers(newState);
      setAllSelected(event.target.checked);
    },
    [teamUsers]
  );

  function onMultiUserRemoval(): void {
    const teamUserIds: string[] = teamUsers.filter(u => u.isSelected).map(u => u.teamUserId);
    fetcher.submit(createFormData(teamUserIds), { method: 'delete', action, encType: 'multipart/form-data' });
    setAllSelected(false);
  }

  function onSingleUserRemoval(teamUserId: string): void {
    fetcher.submit(createFormData([teamUserId]), { method: 'delete', action, encType: 'multipart/form-data' });
    setAllSelected(false);
  }

  function createFormData(teamUserIds: string[]): FormData {
    const formData = new FormData();
    formData.append(FORM_DATA_KEY, JSON.stringify(teamUserIds));
    return formData;
  }

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
          {/*//TODO move edit this to home tab instead*/}
          <EditLink to={`/clubs/${clubId}/teams/${teamId}/edit`} />
          <AddMembersModal postAction={action} existingClubUserIds={clubUserIds} />
          <ConfirmationModal
            title={'Remove users from team'}
            message={'Are you sure?'}
            disabled={nonSelected}
            onSubmit={() => onMultiUserRemoval()}
          >
            <li className={`${nonSelected && 'disabled'}`}>
              <div className={'flex flex-col items-center gap-0'}>
                <AiOutlineDelete size={20} />
                <span className={`text-xs`}>Remove</span>
              </div>
            </li>
          </ConfirmationModal>
          {/*//TODO move delete team to home tab instead?*/}
          {/*<DeleteResourceModal action={`/clubs/${clubId}/teams/${teamId}/delete`} message={'Are you sure you want to delete this team?'} />*/}
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
            <table className="table table-pin-rows">
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
              {Array.from(teamUserMap.entries()).map(([role, users]) => {
                return (
                  users.length > 0 && (
                    <React.Fragment key={role}>
                      <thead>
                        <tr>
                          <th>{TeamRoleMap[role]}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(teamUser => (
                          <TableRow
                            key={teamUser.teamUserId}
                            teamUser={teamUser}
                            clubId={clubId}
                            isAdmin={clubUserRoles.isAdmin}
                            handleSelect={handleSelect}
                            onSingleUserRemoval={onSingleUserRemoval}
                          />
                        ))}
                      </tbody>
                    </React.Fragment>
                  )
                );
              })}
            </table>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

type TableRowProp = {
  teamUser: TeamUser;
  clubId: string | undefined;
  isAdmin: boolean;
  handleSelect: (event: React.ChangeEvent<HTMLInputElement>, teamUserId: string) => void;
  onSingleUserRemoval: (teamUserId: string) => void;
};
function TableRow({
  teamUser: { teamUserId, teamRoles, userId, name, email, imageUrl, createdAt, isSelected },
  clubId,
  isAdmin,
  handleSelect,
  onSingleUserRemoval
}: TableRowProp) {
  return (
    <tr>
      {isAdmin && (
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
        <ConfirmationModal message={'Are you sure?'} onSubmit={() => onSingleUserRemoval(teamUserId)} title={'Remove user from team'}>
          <button className={'btn btn-ghost'}>
            <IoIosRemoveCircleOutline />
          </button>
        </ConfirmationModal>
      </th>
    </tr>
  );
}
