import React, { useEffect, useRef } from 'react';
import { MdAddCircleOutline } from 'react-icons/md';
import { useFetcher, useParams } from '@remix-run/react';
import { $Enums } from '.prisma/client';
import type { TrainingTimeFetcherData } from '~/routes/clubs.$clubId.teams.$teamId.training-time/route';
import useCustomToast from '~/hooks/useCustomToast';
import { IoIosRemoveCircleOutline } from 'react-icons/io';
import ConfirmationModal from '~/components/modal/confirmation-modal';
import { useOutletContext } from 'react-router';
import type { ClientTrainingTime, TeamContext } from '~/routes/clubs.$clubId.teams.$teamId/route';
import { BiEdit } from 'react-icons/bi';
import WeekDay = $Enums.WeekDay;

type Props = { trainingTimes: ClientTrainingTime[] };

export default function TrainingTimeIsland({ trainingTimes }: Props) {
  const fetcher = useFetcher();
  const { clubId, teamId } = useParams();
  const { teamRoles } = useOutletContext<TeamContext>();

  function handleRemove(trainingTimeId: string) {
    const formData = new FormData();
    formData.append('trainingTimeId', trainingTimeId);
    fetcher.submit(formData, {
      method: 'delete',
      action: `/clubs/${clubId}/teams/${teamId}/training-time`,
      encType: 'multipart/form-data'
    });
  }

  return (
    <section className={'inline-flex w-full max-w-screen-sm flex-shrink-0 flex-col gap-2 rounded-xl border p-3'}>
      <h3 className={'text-center text-xl'}>Training times</h3>
      {trainingTimes.map(trainingTime => (
        <div key={trainingTime.id} className={'flex items-center gap-2 text-xs sm:text-sm'}>
          <div className={'flex flex-[5] flex-col overflow-scroll whitespace-nowrap'}>
            <div>{trainingTime.weekDay}</div>
            <div className={'badge badge-neutral badge-sm'}>{trainingTime.location}</div>
          </div>
          <div className={'flex flex-[6] items-center justify-end gap-3'}>
            <div className={'flex gap-1'}>
              <div>{trainingTime.startTime}</div>
              <div>-</div>
              <div>{trainingTime.endTime}</div>
            </div>
            {teamRoles.isTeamLeader && (
              <span className={'flex items-center'}>
                <TrainingTimeModal method={'patch'} defaultTrainingTime={trainingTime}>
                  <BiEdit />
                </TrainingTimeModal>
                <ConfirmationModal
                  message={'Are you sure you want to delete training time?'}
                  title={'Remove Training Time'}
                  onSubmit={() => handleRemove(trainingTime.id)}
                >
                  <button className={'btn btn-circle btn-ghost btn-sm'}>
                    <IoIosRemoveCircleOutline />
                  </button>
                </ConfirmationModal>
              </span>
            )}
          </div>
        </div>
      ))}
      {teamRoles.isTeamLeader && (
        <div className={'flex justify-center'}>
          <TrainingTimeModal method={'post'}>
            <MdAddCircleOutline size={20} />
          </TrainingTimeModal>
        </div>
      )}
    </section>
  );
}

type TTModalProps = { method: 'post' | 'patch'; children: React.ReactElement; defaultTrainingTime?: ClientTrainingTime };
function TrainingTimeModal({ method, children, defaultTrainingTime }: TTModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const fetcher = useFetcher<TrainingTimeFetcherData>();
  const { clubId, teamId } = useParams();

  useCustomToast(fetcher.data?.flash);

  const closeModal = React.useCallback(() => {
    formRef.current?.reset();
    modalRef.current?.close();
    fetcher.load('');
  }, [fetcher]);

  useEffect(() => {
    if (fetcher.data?.ok) {
      formRef.current?.reset();
      modalRef.current?.close();
    }
  }, [fetcher]);

  function renderError(errors: string[] | undefined) {
    return errors?.map(error => (
      <small key={error} className="mt-1 block text-red-500">
        {error}
      </small>
    ));
  }

  return (
    <div className={'cancel-animations'}>
      <button className={'btn btn-circle btn-ghost btn-sm'} onClick={() => modalRef.current?.showModal()}>
        {children}
      </button>

      <dialog id={'add-training-time-manager'} ref={modalRef} className="cancel-animations modal">
        <div className="modal-box flex w-full flex-col lg:max-w-2xl">
          <h3 className="mb-2 text-2xl font-bold">Add Training Time</h3>
          <fetcher.Form ref={formRef} action={`/clubs/${clubId}/teams/${teamId}/training-time`} method={method}>
            <div className={'flex flex-wrap gap-2'}>
              <input hidden id={'trainingTimeId'} name={'trainingTimeId'} defaultValue={defaultTrainingTime?.id} />
              <div className={'form-control'}>
                <label className={'label'} htmlFor={'weekDay'}>
                  Day of week
                </label>
                <select className={'select select-bordered'} id={'weekDay'} name={'weekDay'} defaultValue={defaultTrainingTime?.weekDay}>
                  {Object.values(WeekDay).map(weekDay => (
                    <option key={weekDay}>{weekDay}</option>
                  ))}
                </select>
              </div>

              <div className={'form-control'}>
                <label className={'label'} htmlFor={'startTime'}>
                  Start time
                </label>
                <input
                  className={'input input-bordered'}
                  type="time"
                  id={'startTime'}
                  name={'startTime'}
                  defaultValue={defaultTrainingTime?.startTime}
                />
                {renderError(fetcher.data?.errors?.startTime)}
              </div>

              <div className={'form-control'}>
                <label className={'label'} htmlFor={'endTime'}>
                  End time
                </label>
                <input
                  className={'input input-bordered'}
                  type="time"
                  id={'endTime'}
                  name={'endTime'}
                  defaultValue={defaultTrainingTime?.endTime}
                />
                {renderError(fetcher.data?.errors?.endTime)}
              </div>

              <div className={'form-control'}>
                <label className={'label'} htmlFor={'location'}>
                  Location
                </label>
                <input className={'input input-bordered'} id={'location'} name={'location'} defaultValue={defaultTrainingTime?.location} />
                {renderError(fetcher.data?.errors?.location)}
              </div>
            </div>
            <div className={'mt-4'}>
              <button type={'button'} className={'btn'} onClick={closeModal}>
                Cancel
              </button>
              <button type={'submit'} className={'btn btn-primary float-right'}>
                Save
              </button>
            </div>
          </fetcher.Form>
        </div>
      </dialog>
    </div>
  );
}
