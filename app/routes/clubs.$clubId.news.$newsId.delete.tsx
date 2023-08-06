import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireClubWebmaster } from '~/session.server';
import { deleteClubNews } from '~/models/club-news.server';
import { createS3NewsItemKeyPath, deleteFolder } from '~/s3-utils';
import { errorFlash } from '~/loader-utils';
import { getMessageOrDefault } from '~/misc-utils';

const ERROR_MESSAGE = 'Delete operation failed';

export const action = async ({ request, params: { clubId, newsId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(newsId, 'clubId missing in route');
  await requireClubWebmaster(request, clubId);

  try {
    await deleteClubNews(newsId);
  } catch (e) {
    return json({ flash: errorFlash(getMessageOrDefault(e, ERROR_MESSAGE)) }, { status: 500 });
  }

  try {
    await deleteFolder(createS3NewsItemKeyPath(clubId, newsId));
  } catch (e) {
    console.error(`Failed to delete S3 images for club: ${clubId}, news post: ${newsId}`);
  }

  return redirect(`/clubs/${clubId}/news`);
};
