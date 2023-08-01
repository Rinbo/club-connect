import React, { useMemo } from 'react';
import { useUser } from '~/loader-utils';
import Email from '~/components/misc/email';
import { getGravatarUrl } from '~/misc-utils';
import UploadImageModal from '~/components/upload/upload-image-modal';

export default function Profile() {
  const user = useUser();
  const imageSrc = useMemo(() => {
    return user.imageUrl ? user.imageUrl : getGravatarUrl(user.email);
  }, [user]);

  return (
    <div className={'flex flex-col items-center justify-center gap-2'}>
      <img className="inline-block h-24 w-24 rounded-full ring-2 ring-white" src={imageSrc} alt={user.name} />
      <div className={'text-center text-5xl'}>{user.name}</div>
      <Email email={user.email} />
      <UploadImageModal action={'/dashboard/profile/upload-image'} />
    </div>
  );
}
