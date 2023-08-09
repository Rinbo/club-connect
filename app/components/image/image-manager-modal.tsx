import type { Flash } from '~/hooks/useCustomToast';
import useCustomToast from '~/hooks/useCustomToast';
import { useFetcher } from '@remix-run/react';
import React, { useEffect, useMemo, useRef } from 'react';
import { BsImages } from 'react-icons/bs';
import { AiOutlineDelete } from 'react-icons/ai';
import FileInput from '~/components/form/file-input';

interface ImageUrl {
  url: string;
  id: string;
}
type FetcherData = { flash?: Flash; ok?: boolean } | undefined;

export default function ImageManagerModal(props: { imageUrls: ImageUrl[]; postAction: string; deleteAction: string }) {
  const fetcher = useFetcher<FetcherData>();
  const modalRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const working = useMemo(() => fetcher.state !== 'idle', [fetcher.state]);

  useCustomToast(fetcher.data?.flash);

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
          <BsImages size={20} />
          <span className={`text-xs`}>Images</span>
        </div>
      </li>
      <dialog id={'modal-manager'} ref={modalRef} className="cancel-animations modal">
        <div className="modal-box w-full lg:max-w-4xl">
          {working && <progress className="progress w-full" />}
          <h3 className="mb-2 text-2xl font-bold">Image Manager</h3>

          <section>
            <fetcher.Form method={'post'} action={props.postAction} encType="multipart/form-data">
              <h2 className={'mb-2 text-xl'}>Add images</h2>
              <FileInput label={'Select images'} name={'img'} id={'img-field'} accept={'image/*'} multiple={true} />
              <div className={'mt-2 flex flex-row gap-2'}>
                <button onClick={closeModal} type={'button'} className={'btn'}>
                  Cancel
                </button>
                <button disabled={working} type={'submit'} className={'btn btn-primary'}>
                  Add
                </button>
              </div>
            </fetcher.Form>
          </section>

          {props.imageUrls[0] && (
            <React.Fragment>
              <div className={'divider'} />
              <section className={'flex justify-center'}>
                <div className={'mt-3 w-full lg:max-w-4xl'}>
                  <h2 className={'mb-2 text-xl'}>Remove Images</h2>
                  <fetcher.Form action={props.deleteAction} method={'delete'}>
                    <button type={'submit'} disabled={working} className={'btn btn-sm m-2'}>
                      <AiOutlineDelete size={30} />
                      <span className={'text-xs'}>Delete</span>
                    </button>
                    <div className={'flex flex-row flex-wrap gap-3 rounded-xl border p-3'}>
                      {props.imageUrls.map(imageUrl => (
                        <div key={imageUrl.id} className="relative w-28 rounded">
                          <input
                            name={'imageUrls-' + imageUrl.id}
                            value={JSON.stringify(imageUrl)}
                            type="checkbox"
                            className="checkbox absolute right-1 top-1 z-10 border border-black bg-white"
                          />
                          <img src={imageUrl.url} alt="thumbnail" className={'rounded'} />
                        </div>
                      ))}
                    </div>
                  </fetcher.Form>
                  <button onClick={closeModal} className="btn btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </div>
              </section>
            </React.Fragment>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
