import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireClubAdmin } from '~/session.server';
import { createS3SquareImageUploadHandler } from '~/s3-utils';
import { parseAndProcessImageFormData } from '~/form-data-utils';
import { getMessageOrDefault } from '~/misc-utils';
import invariant from 'tiny-invariant';
import { updateClubLogo } from '~/models/club.server';

export const action = async ({ request, params: { clubId } }: ActionArgs) => {
  invariant(clubId, 'clubId missing from path');
  await requireClubAdmin(request, clubId);
  const uploadHandler = createS3SquareImageUploadHandler(`clubs/${clubId}/club-logo`);

  try {
    const urls = await parseAndProcessImageFormData(request, uploadHandler);
    await updateClubLogo(urls[0], clubId);
  } catch (e) {
    console.error(e);
    return json({ error: getMessageOrDefault(e, 'Something went wrong with image upload') }, { status: 500 });
  }

  return json({ ok: true });
};
