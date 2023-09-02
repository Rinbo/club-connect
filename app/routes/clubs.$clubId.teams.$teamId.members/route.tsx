import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubUser, requireTeamLeader } from '~/session.server';
import { createTeamMembers, deleteTeamMembers, getTeamUsersByTeamId } from '~/models/team.server';
import { Link, useFetcher, useLoaderData, useParams } from '@remix-run/react';
import React, { useRef } from 'react';
import ResourceContextMenu from '~/components/nav/resource-context-menu';
import AddMembersModal from '~/routes/clubs.$clubId.teams.$teamId.members/add-members-modal';
import { errorFlash } from '~/loader-utils';
import { getGravatarUrl } from '~/misc-utils';
import { TeamRole } from '.prisma/client';
import type { TeamRole as TeamRoleType } from '@prisma/client';
import ConfirmationModal from '~/components/modal/confirmation-modal';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoIosRemoveCircleOutline } from 'react-icons/io';
import { LuEdit } from 'react-icons/lu';
import type { Flash } from '~/hooks/useCustomToast';
import useCustomToast from '~/hooks/useCustomToast';
import { useOutletContext } from 'react-router';
import { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId/route';

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
  await requireTeamLeader(request, clubId, teamId);

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
  const { teamUsers: serverUsers } = useLoaderData<{ teamUsers: TeamUser[] }>();
  const { teamRoles } = useOutletContext<TeamContextType>();
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
    <ResourceContextMenu>
      {teamRoles.isTeamLeader && (
        <React.Fragment>
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
                  {teamRoles.isTeamLeader && (
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
                            isAdmin={teamRoles.isTeamLeader}
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
function TableRow({ teamUser, clubId, isAdmin, handleSelect, onSingleUserRemoval }: TableRowProp) {
  return (
    <tr>
      {isAdmin && (
        <th>
          <label>
            <input
              type="checkbox"
              checked={teamUser.isSelected}
              onChange={e => handleSelect(e, teamUser.teamUserId)}
              className="checkbox"
            />
          </label>
        </th>
      )}
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={teamUser.imageUrl ? teamUser.imageUrl : getGravatarUrl(teamUser.email)} alt="User" />
            </div>
          </div>
          <div>
            <div className="font-bold">{teamUser.name}</div>
            <div className="text-sm opacity-50">City</div>
          </div>
        </div>
      </td>
      <td>
        <span className={'flex items-center gap-2'}>
          {teamUser.teamRoles.map(role => (
            <span key={`${role}-${teamUser.teamUserId}`} className="badge badge-ghost badge-sm">
              {role}
            </span>
          ))}

          {isAdmin && <EditTeamRolesModal teamUser={teamUser} />}
        </span>
      </td>
      <td>{new Date(teamUser.createdAt).toDateString()}</td>
      <th>
        <Link to={`/clubs/${clubId}/users/${teamUser.userId}`} key={`link-${teamUser.teamUserId}`} className={'btn btn-ghost btn-xs'}>
          Details
        </Link>
      </th>
      <th>
        <ConfirmationModal
          message={'Are you sure?'}
          onSubmit={() => onSingleUserRemoval(teamUser.teamUserId)}
          title={'Remove user from team'}
        >
          <button className={'btn btn-ghost'}>
            <IoIosRemoveCircleOutline />
          </button>
        </ConfirmationModal>
      </th>
    </tr>
  );
}

function EditTeamRolesModal({ teamUser }: { teamUser: TeamUser }) {
  const fetcher = useFetcher<{ flash?: Flash } | undefined>();
  const modalRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { clubId, teamId } = useParams();

  useCustomToast(fetcher.data?.flash);

  function closeModal() {
    formRef.current?.reset();
    modalRef.current?.close();
  }

  return (
    <div className={'cancel-animations'}>
      <button className={'btn btn-ghost'} onClick={() => modalRef.current?.showModal()}>
        <LuEdit />
      </button>
      <dialog id="modal-delete-image" ref={modalRef} className="cancel-animations modal">
        <div className="modal-box">
          <h3 className="mb-2 text-lg font-bold">{`Edit ${teamUser.name}'s team role`}</h3>
          <div className={'my-2'}>Select Role</div>
          <fetcher.Form ref={formRef} method={'post'} action={`/clubs/${clubId}/teams/${teamId}/edit-role`}>
            <div className={'flex flex-col gap-2'}>
              <div className={'form-control mb-4'}>
                <input hidden readOnly name={'teamUserId'} id="teamUserId" value={teamUser.teamUserId} />
                <select
                  id={'teamRole'}
                  name={'teamRole'}
                  defaultValue={teamUser.teamRoles.length > 0 ? teamUser.teamRoles[0] : undefined}
                  className={'select select-bordered select-sm w-full'}
                >
                  {Object.values(TeamRole).map(option => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className={'flex gap-2'}>
                <button type="button" className={'btn'} onClick={closeModal}>
                  Cancel
                </button>
                <button type={'submit'} className={'btn btn-warning float-right'}>
                  Save
                </button>
              </div>
            </div>
          </fetcher.Form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
