import React, { useEffect, useMemo, useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import type { Flash } from '~/hooks/useCustomToast';
import DropDown from '~/components/form/dropdown';
import { FaUsersCog } from 'react-icons/fa';

type FetcherData = { flash?: Flash; ok?: boolean } | undefined;

export default function AddMembersModal({ postAction }: { postAction: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const fetcher = useFetcher<FetcherData>();
  const working = useMemo(() => fetcher.state !== 'idle', [fetcher.state]);

  useEffect(() => {
    if (fetcher.data?.ok) closeModal();
  }, [fetcher.data]);

  function closeModal() {
    formRef.current?.reset();
    modalRef.current?.close();
  }

  return (
    <div className={'cancel-animations'}>
      <li onClick={() => modalRef.current?.showModal()}>
        <div className={'flex flex-col items-center gap-0'}>
          <FaUsersCog size={20} />
          <span className={`text-xs`}>Add Members</span>
        </div>
      </li>
      <dialog id={'modal-manager'} ref={modalRef} className="cancel-animations modal">
        <div className="modal-box w-full lg:max-w-4xl">
          {working && <progress className="progress w-full" />}
          <h3 className="mb-2 text-2xl font-bold">Team Member Manager</h3>
          <section>
            <fetcher.Form ref={formRef} method={'post'} action={postAction}>
              <DropDown options={['LEADER', 'PLAYER']} name={'members'} id={'members'} label={'Add member'} errors={null} />
              <div className={'mt-6 flex flex-row gap-2'}>
                <button onClick={closeModal} type={'button'} className={'btn'}>
                  Cancel
                </button>
                <button disabled={working} type={'submit'} className={'btn btn-primary'}>
                  Add
                </button>
              </div>
            </fetcher.Form>
          </section>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
