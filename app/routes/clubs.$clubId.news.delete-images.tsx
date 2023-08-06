import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireClubWebmaster } from '~/session.server';
import invariant from 'tiny-invariant';
import { deleteS3Objects } from '~/s3-utils';
import { deleteClubNewsImages } from '~/models/club-news.server';

export const action = async ({ request, params: { clubId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing in route');
  await requireClubWebmaster(request, clubId);

  const formData = await request.formData();

  const imageUrls = Object.values(Object.fromEntries(formData))
    .map(e => e.toString())
    .map(e => JSON.parse(e));

  await deleteClubNewsImages(imageUrls.map(e => e.id));

  const urls = imageUrls.map(imageUrl => imageUrl.url);
  await deleteS3Objects(urls.map(url => decodeURIComponent(new URL(url).pathname.slice(1))));

  return json({});
};
