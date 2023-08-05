import { Form, useActionData } from '@remix-run/react';
import TextInput from '~/components/form/text-input';
import React from 'react';
import TextArea from '~/components/form/text-area';
import Toggle from '~/components/form/toggle';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { object, string } from 'zod';
import { createS3StandardImageUploadHandler } from '~/s3-utils';
import { parseAndProcessFormData } from '~/form-data-utils';
import type { Flash } from '~/hooks/useCustomToast';
import useCustomToast from '~/hooks/useCustomToast';
import { errorFlash } from '~/loader-utils';
import FileInput from '~/components/form/file-input';
import { requireClubAdmin } from '~/session.server';
import { createClubNews } from '~/models/club-news.server';

const clubNewsSchema = object({
  title: string().min(2).max(60).trim(),
  body: string().nonempty().trim()
});

type ActionData = {
  errors?: { title?: string[]; body: string[]; img: string[] };
  flash?: Flash;
};

export const action = async ({ request, params: { clubId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in routes');
  const userId = await requireClubAdmin(request, clubId);

  const uploadHandler = createS3StandardImageUploadHandler(`clubs/${clubId}/club-news`);

  try {
    const map = await parseAndProcessFormData(request, uploadHandler);
    const validation = clubNewsSchema.safeParse(Object.fromEntries(map));

    if (!validation.success) return json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });

    const { title, body } = validation.data;

    const clubNewsItem = await createClubNews(title, body, map.get('isPublic') === 'on', map.get('imageUrls') || [], clubId, userId);

    return redirect(`/clubs/${clubId}/news/${clubNewsItem.id}`);
  } catch (e) {
    console.error(e);
    return json({ flash: errorFlash('Image upload failed') }, { status: 500 });
  }
};

export default function CreateClubNews() {
  const actionData = useActionData<ActionData>();
  useCustomToast(actionData?.flash);

  return (
    <div className={'flex justify-center py-4'}>
      <Form method={'post'} className={'w-full max-w-xl'} encType="multipart/form-data">
        <TextInput label={'Title'} name={'title'} id={'title'} type={'text'} errors={actionData?.errors?.title} />
        <TextArea label={'Body'} name={'body'} id={'body'} errors={actionData?.errors?.body} />
        <Toggle label={'Publicly viewable'} name={'isPublic'} id={'isPublic'} />
        <FileInput label={'Select images'} name={'img'} id={'img-field'} accept={'image/*'} multiple={true} />
        <button type={'submit'} className={'btn btn-primary float-right mt-2'}>
          Submit
        </button>
      </Form>
    </div>
  );
}
