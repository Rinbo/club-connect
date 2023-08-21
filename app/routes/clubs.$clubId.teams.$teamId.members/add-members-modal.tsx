import React, { useEffect, useMemo, useRef } from 'react';
import { useFetcher, useParams } from '@remix-run/react';
import type { Flash } from '~/hooks/useCustomToast';
import useCustomToast from '~/hooks/useCustomToast';
import { FaUsersCog } from 'react-icons/fa';
import type { ClubUser as PrismaClubUser, TeamRole as TeamRoleType, User } from '@prisma/client';
import { $Enums } from '@prisma/client';
import { RxCross1 } from 'react-icons/rx';
import type { MemberDto } from '~/routes/clubs.$clubId.teams.$teamId.members/route';
import { FORM_DATA_KEY } from '~/routes/clubs.$clubId.teams.$teamId.members/route';
import TeamRole = $Enums.TeamRole;

type ClubUser = Omit<PrismaClubUser & { user: Omit<User, 'createdAt' | 'updatedAt'> }, 'createdAt' | 'updatedAt'>;
type SelectedUser = ClubUser & { teamRole: TeamRoleType };
type FetcherData = { flash?: Flash; ok?: boolean; clubUsers: ClubUser[] } | undefined;

export default function AddMembersModal({ postAction, existingClubUserIds }: { postAction: string; existingClubUserIds: string[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const { clubId } = useParams();
  const fetcher = useFetcher<FetcherData>();
  const [selectedUsers, setSelectedUsers] = React.useState<SelectedUser[]>([]);
  const getAction = `/clubs/${clubId}/search-user`;

  useCustomToast(fetcher.data?.flash);

  const closeModal = React.useCallback(() => {
    formRef.current?.reset();
    modalRef.current?.close();
    setSelectedUsers([]);
  }, []);

  useEffect(() => {
    if (fetcher.data?.ok) closeModal();
  }, [fetcher.data, closeModal]);

  function submit() {
    const members: MemberDto[] = selectedUsers.map(u => ({ clubUserId: u.id, teamRole: u.teamRole }));
    const formData = new FormData();
    formData.append(FORM_DATA_KEY, JSON.stringify(members));
    fetcher.submit(formData, { method: 'post', action: postAction, encType: 'multipart/form-data' });
  }

  const working = useMemo(() => fetcher.state !== 'idle', [fetcher.state]);

  const selectedUserIds = React.useMemo(() => selectedUsers.map(u => u.id), [selectedUsers]);

  const filteredUsers = React.useMemo(() => {
    if (!fetcher.data?.clubUsers) return [];
    return fetcher.data.clubUsers.filter(clubUser => !selectedUserIds.includes(clubUser.id));
  }, [fetcher.data, selectedUserIds]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    fetcher.submit(e.target.form);
  }

  function select(clubUser: ClubUser) {
    const selectedUser: SelectedUser = { ...clubUser, teamRole: TeamRole.TEAM_PLAYER };
    setSelectedUsers(prevState => [...prevState, selectedUser]);
  }

  function remove(id: string) {
    setSelectedUsers(prevState => prevState.filter(selectedUser => selectedUser.id !== id));
  }

  function onRoleChange(e: React.ChangeEvent<HTMLSelectElement>, selectedUser: SelectedUser) {
    const foundUser = selectedUsers.find(u => u.id === selectedUser.id);
    if (!foundUser) return;

    const selectedUserUpdate = selectedUsers.map(u => {
      if (u.id === selectedUser.id) {
        return { ...u, teamRole: e.target.value as TeamRoleType };
      }
      return u;
    });

    setSelectedUsers(selectedUserUpdate);
  }

  return (
    <div className={'cancel-animations'}>
      <li onClick={() => modalRef.current?.showModal()}>
        <div className={'flex flex-col items-center gap-0'}>
          <FaUsersCog size={20} />
          <span className={`text-xs`}>Add</span>
        </div>
      </li>
      <dialog id={'modal-manager'} ref={modalRef} className="cancel-animations modal">
        <div className="modal-box flex h-2/3 w-full flex-col lg:max-w-2xl">
          <h3 className="mb-2 text-2xl font-bold">Add Team Members</h3>
          <fetcher.Form method="get" action={getAction} ref={formRef}>
            <input
              onChange={handleInputChange}
              type={'text'}
              name="name-query"
              className={'input input-info my-2 w-full'}
              placeholder={'Search for users'}
            />
          </fetcher.Form>

          {filteredUsers.length > 0 && (
            <div className={'flex flex-col gap-y-4 rounded-xl border p-2'}>
              {filteredUsers.map(clubUser => (
                <div className={'flex items-center justify-between'} key={clubUser.id}>
                  <div>{clubUser.user.name}</div>
                  <input name="clubUserId" value={clubUser.user.id} readOnly hidden />
                  <button
                    disabled={existingClubUserIds.includes(clubUser.id)}
                    className={'btn btn-primary btn-sm'}
                    onClick={() => select(clubUser)}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedUsers.length > 0 && (
            <React.Fragment>
              <section className={'flex flex-grow flex-col-reverse gap-2'}>
                {selectedUsers.map(selectedUser => (
                  <div key={`s-${selectedUser.id}`} className={'flex items-center gap-4'}>
                    <div className={'w-32 truncate'}>{selectedUser.user.name}</div>

                    <div className={'form-control'}>
                      <select
                        id={'members'}
                        name={'members'}
                        defaultValue={selectedUser.teamRole}
                        className={'select select-bordered select-sm w-full'}
                        onChange={e => onRoleChange(e, selectedUser)}
                      >
                        {Object.values(TeamRole).map(option => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <button className={'btn btn-ghost'} onClick={() => remove(selectedUser.id)}>
                      <RxCross1 />
                    </button>
                  </div>
                ))}
              </section>
              <div className={'mt-6 flex flex-row gap-2'}>
                <button onClick={closeModal} type={'button'} className={'btn'}>
                  Cancel
                </button>
                <button disabled={working} type={'submit'} className={'btn btn-primary'} onClick={submit}>
                  Add
                </button>
              </div>
            </React.Fragment>
          )}
          <button onClick={closeModal} className="btn btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </div>
      </dialog>
    </div>
  );
}
