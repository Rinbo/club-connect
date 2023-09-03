import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireTeamWebmaster } from '~/session.server';
import { deleteS3Objects, mapImageUrlsToS3ObjectKey } from '~/s3-utils';
import { deleteTeamNewsImages } from '~/models/team-news.server';

export const action = async ({ request, params: { clubId, newsId, teamId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  invariant(newsId, 'newsId missing in route');
  invariant(teamId, 'teamId missing in route');
  await requireTeamWebmaster(request, clubId, teamId);

  const formData = await request.formData();

  const imageUrls = Object.values(Object.fromEntries(formData))
    .map(e => e.toString())
    .map(e => JSON.parse(e));

  await deleteTeamNewsImages(
    imageUrls.map(e => e.id),
    newsId
  );

  const urls = imageUrls.map(imageUrl => imageUrl.url);
  await deleteS3Objects(mapImageUrlsToS3ObjectKey(urls));

  return json({});
};
