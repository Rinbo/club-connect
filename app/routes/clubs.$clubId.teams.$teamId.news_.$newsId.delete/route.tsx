import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireTeamWebmaster } from '~/session.server';
import { errorFlash } from '~/loader-utils';
import { getMessageOrDefault } from '~/misc-utils';
import { createS3TeamNewsItemKeyPath, deleteFolder } from '~/s3-utils';
import { deleteTeamNews } from '~/models/team-news.server';

const ERROR_MESSAGE = 'Delete operation failed';

export const action = async ({ request, params: { clubId, newsId, teamId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(newsId, 'clubId missing in route');
  invariant(teamId, 'teamId missing in route');
  await requireTeamWebmaster(request, clubId, teamId);

  try {
    await deleteTeamNews(newsId, teamId);
  } catch (e) {
    return json({ flash: errorFlash(getMessageOrDefault(e, ERROR_MESSAGE)) }, { status: 500 });
  }

  try {
    await deleteFolder(createS3TeamNewsItemKeyPath(clubId, newsId, teamId));
  } catch (e) {
    console.error(`Failed to delete S3 images for club: ${clubId}, news post: ${newsId}`);
  }

  return redirect(`/clubs/${clubId}/teams/${teamId}/news`);
};
