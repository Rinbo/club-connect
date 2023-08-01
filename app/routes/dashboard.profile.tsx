import React, { useEffect, useMemo, useRef } from 'react';
import { useUser } from '~/loader-utils';
import Email from '~/components/misc/email';
import { getGravatarUrl, getMessageOrDefault } from '~/misc-utils';
import { useFetcher } from '@remix-run/react';
import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUserId } from '~/session.server';
import { createS3ResizeImageUploadHandler } from '~/s3-utils';
import { parseAndProcessFormData } from '~/form-data-utils';
import { updateProfileImage } from '~/models/user.server';

type FetcherData = {
  ok: boolean;
  error?: string;
};

// TODO move to resource route /dashboard/profile/image-upload
export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const uploadHandler = createS3ResizeImageUploadHandler(`profile-image/${userId}`);

  try {
    const urls = await parseAndProcessFormData(request, uploadHandler);
    await updateProfileImage(urls[0], userId);
  } catch (e) {
    console.error(e);
    return json({ error: getMessageOrDefault(e, 'Something went wrong with upload') }, { status: 500 });
  }

  return json({ ok: true });
};

export default function Profile() {
  const user = useUser();
  const imageSrc = useMemo(() => {
    return user.imageUrl ? user.imageUrl : getGravatarUrl(user.email);
  }, [user]);

  return (
    <div className={'flex flex-col items-center justify-center gap-2'}>
      <img className="inline-block h-24 w-24 rounded-full ring-2 ring-white" src={imageSrc} alt={user.name} />
      <div className={'text-center text-5xl'}>{user.name}</div>
      <Email email={user.email} />
      <UploadImage />
    </div>
  );
}

// TODO make generic and pass resource route to it to be used in fetcher#action
function UploadImage() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher<FetcherData>();

  useEffect(() => {
    if (fetcher.data?.ok) {
      formRef.current?.reset();
      modalRef.current?.close();
    }
  }, [fetcher.data]);

  return (
    <React.Fragment>
      <button className="btn btn-primary" onClick={() => modalRef.current?.showModal()}>
        Upload Profile Image
      </button>
      <dialog id="modal" ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="mb-2 text-lg font-bold">Upload picture</h3>
          <fetcher.Form ref={formRef} method={'post'} encType="multipart/form-data" action={'/dashboard/profile'}>
            <input className={'file-input mb-2 w-full max-w-xs'} id="img-field" type="file" multiple name="img" accept="image/*" />
            <button type={'submit'} className={'btn btn-info float-right'}>
              Save
            </button>
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
