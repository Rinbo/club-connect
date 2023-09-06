import type { TrainingTime } from '~/routes/clubs.$clubId.teams.$teamId.schedule/route';
import React, { useRef } from 'react';
import { AiOutlineFieldTime } from 'react-icons/ai';

type Props = { trainingTimes: TrainingTime[] };

export default function TrainingTimeIsland({ trainingTimes }: Props) {
  return <div>{JSON.stringify(trainingTimes)}</div>;
}

function AddTrainingTimeModal() {
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  const closeModal = React.useCallback(() => {
    formRef.current?.reset();
    modalRef.current?.close();
  }, []);

  return (
    <div className={'cancel-animations'}>
      <li onClick={() => modalRef.current?.showModal()}>
        <div className={'flex flex-col items-center gap-0'}>
          <AiOutlineFieldTime size={20} />
          <span className={`text-xs`}>Add</span>
        </div>
      </li>

      <dialog id={'modal-manager'} ref={modalRef} className="cancel-animations modal">
        <div className="modal-box flex h-2/3 w-full flex-col lg:max-w-2xl">
          <h3 className="mb-2 text-2xl font-bold">Add Team Members</h3>
        </div>
      </dialog>
    </div>
  );
}
