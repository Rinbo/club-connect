import { useFetcher } from '@remix-run/react';
import type { Flash } from '~/hooks/useCustomToast';
import useCustomToast from '~/hooks/useCustomToast';
import React, { useRef } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

type FetcherData = { flash?: Flash } | undefined;

export default function DeleteResourceModal({ action, message }: { action: string; message: string }) {
  const fetcher = useFetcher<FetcherData>();
  const modalRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useCustomToast(fetcher.data?.flash);

  function closeModal() {
    formRef.current?.reset();
    modalRef.current?.close();
  }

  return (
    <React.Fragment>
      <li onClick={() => modalRef.current?.showModal()}>
        <div className={'flex flex-col items-center gap-0'}>
          <AiOutlineDelete size={20} />
          <span className={`text-xs `}>Delete</span>
        </div>
      </li>
      <dialog id="modal" ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="mb-2 text-lg font-bold">Delete Action</h3>
          <div>{message}</div>
          <fetcher.Form ref={formRef} method={'delete'} action={action}>
            <div className={'flex justify-end gap-2'}>
              <button type="button" className={'btn'} onClick={closeModal}>
                Cancel
              </button>
              <button type={'submit'} className={'btn btn-warning float-right'}>
                Delete
              </button>
            </div>
          </fetcher.Form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </React.Fragment>
  );
}
