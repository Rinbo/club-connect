import { Form, useActionData, useFetcher, useNavigate, useParams } from '@remix-run/react';
import TextInput from '~/components/form/text-input';
import React from 'react';
import TextArea from '~/components/form/text-area';
import Toggle from '~/components/form/toggle';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { object, string } from 'zod';
import type { Flash } from '~/hooks/useCustomToast';
import useCustomToast from '~/hooks/useCustomToast';
import { errorFlash, useClubNewsItem } from '~/loader-utils';
import { requireClubAdmin } from '~/session.server';
import { updateClubNews } from '~/models/club-news.server';
import type { ClubNewsImageUrls } from '.prisma/client';

const clubNewsSchema = object({
  title: string().min(2).max(60).trim(),
  body: string().nonempty().trim()
});

type ActionData = {
  errors?: { title?: string[]; body: string[]; img: string[] };
  flash?: Flash;
};

export const action = async ({ request, params: { clubId, newsId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in routes');
  invariant(newsId, 'newsId missing in routes');
  await requireClubAdmin(request, clubId);

  const formData = await request.formData();

  const validation = clubNewsSchema.safeParse(Object.fromEntries(formData));
  if (!validation.success) return json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });

  const { title, body } = validation.data;

  try {
    const clubNewsItem = await updateClubNews(newsId, title, body, formData.get('isPublic') === 'on', clubId);
    return redirect(`/clubs/${clubId}/news/${clubNewsItem.id}`);
  } catch (e) {
    console.error(e);
    return json({ flash: errorFlash('Update failed') }, { status: 500 });
  }
};

export default function CreateClubNews() {
  const actionData = useActionData<ActionData>();
  const newsItem = useClubNewsItem();
  const imageUrls = newsItem.imageUrls;
  const navigate = useNavigate();

  useCustomToast(actionData?.flash);

  return (
    <React.Fragment>
      <section className={'flex justify-center py-4'}>
        <Form method={'post'} className={'w-full max-w-4xl'}>
          <TextInput
            label={'Title'}
            name={'title'}
            id={'title'}
            type={'text'}
            defaultValue={newsItem.title}
            errors={actionData?.errors?.title}
          />
          <TextArea label={'Body'} name={'body'} id={'body'} defaultValue={newsItem.body} errors={actionData?.errors?.body} />
          <Toggle label={'Publicly viewable'} name={'isPublic'} id={'isPublic'} defaultChecked={newsItem.isPublic} />
          <button onClick={() => navigate(-1)} type={'button'} className={'btn float-left mt-2'}>
            Cancel
          </button>
          <button type={'submit'} className={'btn btn-primary float-right mt-2'}>
            Save
          </button>
        </Form>
      </section>
      {imageUrls[0] && <ImageManager imageUrls={imageUrls} />}
    </React.Fragment>
  );
}

function ImageManager(props: { imageUrls: ClubNewsImageUrls[] }) {
  const fetcher = useFetcher();
  const { clubId } = useParams();

  return (
    <section className={'flex justify-center'}>
      <div className={'mt-3 w-full max-w-4xl'}>
        <h2 className={'mb-2 text-xl'}>Image manager</h2>
        <fetcher.Form
          className={'flex flex-row flex-wrap gap-3 rounded-xl border p-3'}
          action={`/clubs/${clubId}/news/delete-images`}
          method={'delete'}
        >
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
          <div className={'w-full'}></div>
          <button type={'submit'} className={'btn btn-warning'}>
            Delete
          </button>
        </fetcher.Form>
      </div>
    </section>
  );
}
