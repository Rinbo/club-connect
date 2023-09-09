import type { TrainingTime } from '~/routes/clubs.$clubId.teams.$teamId.schedule/route';
import React, { useEffect, useRef } from 'react';
import { MdAddCircleOutline } from 'react-icons/md';
import { useFetcher, useParams } from '@remix-run/react';
import { $Enums } from '.prisma/client';
import type { TrainingTimeFetcherData } from '~/routes/clubs.$clubId.teams.$teamId.training-time/route';
import useCustomToast from '~/hooks/useCustomToast';
import { IoIosRemoveCircleOutline } from 'react-icons/io';
import { LuEdit } from 'react-icons/lu';
import ConfirmationModal from '~/components/modal/confirmation-modal';
import { useOutletContext } from 'react-router';
import type { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId/route';
import WeekDay = $Enums.WeekDay;

type Props = { trainingTimes: TrainingTime[] };

export default function TrainingTimeIsland({ trainingTimes }: Props) {
  const fetcher = useFetcher();
  const { clubId, teamId } = useParams();
  const { teamRoles } = useOutletContext<TeamContextType>();

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
    <section className={'inline-flex w-full max-w-screen-xs flex-col gap-2 rounded-xl border p-3'}>
      <h3 className={'text-center text-xl'}>Training times</h3>
      {trainingTimes.map(trainingTime => (
        <div key={trainingTime.id} className={'flex items-center gap-4'}>
          <div className={'flex grow flex-col items-start'}>
            <div>{trainingTime.weekDay}</div>
            <div className={'badge badge-neutral badge-sm'}>{trainingTime.location}</div>
          </div>
          <div className={'flex items-center gap-2 text-sm'}>
            <div>{trainingTime.startTime}</div>
            <div>-</div>
            <div>{trainingTime.endTime}</div>
            {teamRoles.isTeamLeader && (
              <span className={'ml-2 flex'}>
                <button className={'btn btn-circle btn-ghost'}>
                  <LuEdit />
                </button>
                <ConfirmationModal
                  message={'Are you sure you want to delete training time?'}
                  title={'Remove Training Time'}
                  onSubmit={() => handleRemove(trainingTime.id)}
                >
                  <button className={'btn btn-circle btn-ghost'}>
                    <IoIosRemoveCircleOutline />
                  </button>
                </ConfirmationModal>
              </span>
            )}
          </div>
        </div>
      ))}
      <div className={'flex justify-center'}>
        <AddTrainingTimeModal />
      </div>
    </section>
  );
}

function AddTrainingTimeModal() {
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
      <button className={'btn btn-circle btn-ghost'} onClick={() => modalRef.current?.showModal()}>
        <MdAddCircleOutline size={25} />
      </button>

      <dialog id={'add-training-time-manager'} ref={modalRef} className="cancel-animations modal">
        <div className="modal-box flex w-full flex-col lg:max-w-2xl">
          <h3 className="mb-2 text-2xl font-bold">Add Training Time</h3>
          <fetcher.Form ref={formRef} action={`/clubs/${clubId}/teams/${teamId}/training-time`} method={'post'}>
            <div className={'flex flex-wrap gap-2'}>
              <div className={'form-control'}>
                <label className={'label'} htmlFor={'weekDay'}>
                  Day of week
                </label>
                <select className={'select select-bordered'} id={'weekDay'} name={'weekDay'}>
                  {Object.values(WeekDay).map(weekDay => (
                    <option key={weekDay}>{weekDay}</option>
                  ))}
                </select>
              </div>

              <div className={'form-control'}>
                <label className={'label'} htmlFor={'startTime'}>
                  Start time
                </label>
                <input className={'input input-bordered'} type="time" id={'startTime'} name={'startTime'} />
                {renderError(fetcher.data?.errors?.startTime)}
              </div>

              <div className={'form-control'}>
                <label className={'label'} htmlFor={'endTime'}>
                  End time
                </label>
                <input className={'input input-bordered'} type="time" id={'endTime'} name={'endTime'} />
                {renderError(fetcher.data?.errors?.endTime)}
              </div>

              <div className={'form-control'}>
                <label className={'label'} htmlFor={'location'}>
                  Location
                </label>
                <input className={'input input-bordered'} id={'location'} name={'location'} />
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
