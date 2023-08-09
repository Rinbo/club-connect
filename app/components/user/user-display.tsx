import React from 'react';
import { getGravatarUrl } from '~/misc-utils';

type UserProps = { name: string; email: string; phone?: string; address?: string; imageUrl?: string | null };

interface Props {
  user: UserProps;
  children?: React.ReactNode;
}

export default function UserDisplay({ user, children }: Props) {
  return (
    <div className="mt-2 flex flex-col items-center justify-center lg:mt-8">
      <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={user.imageUrl ? user.imageUrl : getGravatarUrl(user.email)}
            alt="User Profile"
            className="h-24 w-24 rounded-full border-4 border-accent"
          />
          <div>
            <h2 className="text-2xl font-bold text-accent">{user.name}</h2>
            <p className="info-content text-sm">{user.email}</p>
          </div>
        </div>
        <hr className="border-gray-200" />
        {children}
      </div>
    </div>
  );
}
