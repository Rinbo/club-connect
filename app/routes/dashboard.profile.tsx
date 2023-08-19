import React from 'react';
import { useUser } from '~/loader-utils';
import UploadImageModal from '~/components/upload/upload-image-modal';
import UserDisplay from '~/components/user/user-display';
import { AiOutlinePhone } from 'react-icons/ai';
import { FaRegAddressCard } from 'react-icons/fa';

export default function Profile() {
  const user = useUser();

  return (
    <UserDisplay user={user}>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <AiOutlinePhone size={30} />
          <span className="text-lg">+46 555 555 55</span>
        </div>
        <div className="flex items-center gap-4">
          <FaRegAddressCard size={30} />
          <span className="text-lg">
            Generic Street 17
            <br />
            City
          </span>
        </div>
      </div>
      <UploadImageModal action={'/dashboard/profile/upload-image'} />
    </UserDisplay>
  );
}
