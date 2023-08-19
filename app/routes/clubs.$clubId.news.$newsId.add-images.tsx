import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubWebmaster } from '~/session.server';
import { createS3NewsItemKeyPath, createS3StandardImageUploadHandler } from '~/s3-utils';
import { parseAndProcessImageFormData } from '~/form-data-utils';
import { createClubNewsImages } from '~/models/club-news.server';
import { errorFlash } from '~/loader-utils';
import { getMessageOrDefault } from '~/misc-utils';

export const action = async ({ request, params: { clubId, newsId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing from route');
  invariant(newsId, 'newsId missing from route');
  await requireClubWebmaster(request, clubId);

  const uploadHandler = createS3StandardImageUploadHandler(createS3NewsItemKeyPath(clubId, newsId));
  try {
    const urls = await parseAndProcessImageFormData(request, uploadHandler);
    await createClubNewsImages(urls, newsId);
  } catch (e) {
    return json({ flash: errorFlash(getMessageOrDefault(e, 'Adding images failed')) }, { status: 500 });
  }

  return json({ ok: true });
};
