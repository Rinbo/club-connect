import { ActionArgs, json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireTeamWebmaster } from '~/session.server';
import { createS3StandardImageUploadHandler, createS3TeamNewsItemKeyPath } from '~/s3-utils';
import { parseAndProcessImageFormData } from '~/form-data-utils';
import { errorFlash } from '~/loader-utils';
import { getMessageOrDefault } from '~/misc-utils';
import { createTeamNewsImages } from '~/models/team-news.server';

export const action = async ({ request, params: { clubId, newsId, teamId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing from route');
  invariant(newsId, 'newsId missing from route');
  invariant(teamId, 'teamId missing from route');
  await requireTeamWebmaster(request, clubId, teamId);

  const uploadHandler = createS3StandardImageUploadHandler(createS3TeamNewsItemKeyPath(clubId, teamId, newsId));
  try {
    const urls = await parseAndProcessImageFormData(request, uploadHandler);
    await createTeamNewsImages(urls, newsId);
  } catch (e) {
    return json({ flash: errorFlash(getMessageOrDefault(e, 'Adding images failed')) }, { status: 500 });
  }

  return json({ ok: true });
};
