import UploadImageModal from '~/components/upload/upload-image-modal';
import { useParams } from '@remix-run/react';

export default function ClubSettings() {
  const { clubId } = useParams();
  return (
    <div>
      <div className={'mb-4 text-center text-5xl'}>Club Settings</div>
      <UploadImageModal action={`/clubs/${clubId}/settings/upload-logo`} />
    </div>
  );
}
