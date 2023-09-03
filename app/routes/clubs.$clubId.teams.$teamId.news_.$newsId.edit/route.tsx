import { object, string } from 'zod';
import type { Flash } from '~/hooks/useCustomToast';
import useCustomToast from '~/hooks/useCustomToast';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireTeamWebmaster } from '~/session.server';
import { errorFlash } from '~/loader-utils';
import { Form, useActionData, useNavigate } from '@remix-run/react';
import React from 'react';
import TextInput from '~/components/form/text-input';
import TextArea from '~/components/form/text-area';
import { useOutletContext } from 'react-router';
import type { TeamNewsContext } from '~/routes/clubs.$clubId.teams.$teamId.news_.$newsId/route';
import { updateTeamNews } from '~/models/team-news.server';

const teamNewsSchema = object({
  title: string().min(2).max(60).trim(),
  body: string().nonempty().trim()
});

type ActionData = {
  errors?: { title?: string[]; body: string[]; img: string[] };
  flash?: Flash;
};

export const action = async ({ request, params: { clubId, teamId, newsId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in routes');
  invariant(teamId, 'teamId missing in routes');
  invariant(newsId, 'newsId missing in routes');
  await requireTeamWebmaster(request, clubId, teamId);

  const formData = await request.formData();

  const validation = teamNewsSchema.safeParse(Object.fromEntries(formData));
  if (!validation.success) return json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });

  const { title, body } = validation.data;

  try {
    const clubNewsItem = await updateTeamNews(newsId, title, body, teamId);
    return redirect(`/clubs/${clubId}/teams/${teamId}/news/${clubNewsItem.id}`);
  } catch (e) {
    console.error(e);
    return json({ flash: errorFlash('Update failed') }, { status: 500 });
  }
};

export default function EditTeamNews() {
  const actionData = useActionData<ActionData>();
  const { newsItem } = useOutletContext<TeamNewsContext>();
  const navigate = useNavigate();

  useCustomToast(actionData?.flash);

  return (
    <React.Fragment>
      <section className={'flex justify-center py-4'}>
        <Form replace method={'post'} className={'w-full max-w-4xl'}>
          <TextInput
            label={'Title'}
            name={'title'}
            id={'title'}
            type={'text'}
            defaultValue={newsItem.title}
            errors={actionData?.errors?.title}
          />
          <TextArea label={'Body'} name={'body'} id={'body'} defaultValue={newsItem.body} errors={actionData?.errors?.body} />
          <button onClick={() => navigate(-1)} type={'button'} className={'btn float-left mt-2'}>
            Cancel
          </button>
          <button type={'submit'} className={'btn btn-primary float-right mt-2'}>
            Save
          </button>
        </Form>
      </section>
    </React.Fragment>
  );
}
