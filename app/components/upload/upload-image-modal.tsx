import React, { useEffect, useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import { BsCardImage } from 'react-icons/bs';
import FileInput from '~/components/form/file-input';

type FetcherData = {
  ok: boolean;
  error?: string;
};

export default function UploadImageModal({ action }: { action: string }) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher<FetcherData>();

  useEffect(() => {
    if (fetcher.data?.ok) closeModal();
  }, [fetcher.data]);

  function closeModal() {
    formRef.current?.reset();
    modalRef.current?.close();
  }

  return (
    <React.Fragment>
      <button className="btn btn-primary" onClick={() => modalRef.current?.showModal()}>
        <BsCardImage />
        Upload Image
      </button>
      <dialog id="modal" ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="mb-2 text-lg font-bold">Upload picture</h3>
          <fetcher.Form ref={formRef} method={'post'} encType="multipart/form-data" action={action}>
            <FileInput label={'Select image'} id="img-field" name="img" />
            <div className={'flex justify-end gap-2'}>
              <button type="button" className={'btn'} onClick={closeModal}>
                Cancel
              </button>
              <button type={'submit'} className={'btn btn-info float-right'}>
                Save
              </button>
            </div>

            {fetcher.data?.error && <div className={'text-error'}>{fetcher.data.error}</div>}
          </fetcher.Form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </React.Fragment>
  );
}
