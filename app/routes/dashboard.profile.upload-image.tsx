import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUserId } from '~/session.server';
import { createS3ResizeImageUploadHandler } from '~/s3-utils';
import { parseAndProcessFormData } from '~/form-data-utils';
import { updateProfileImage } from '~/models/user.server';
import { getMessageOrDefault } from '~/misc-utils';

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const uploadHandler = createS3ResizeImageUploadHandler(`profile-image/${userId}`);

  try {
    const urls = await parseAndProcessFormData(request, uploadHandler);
    await updateProfileImage(urls[0], userId);
  } catch (e) {
    console.error(e);
    return json({ error: getMessageOrDefault(e, 'Something went wrong with upload') }, { status: 500 });
  }

  return json({ ok: true });
};
