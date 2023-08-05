import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from '@remix-run/react';

export default function ResourceContextMenu({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <ul className="menu-animate-down no-scrollbar menu rounded-box menu-horizontal menu-xs mb-4 w-full flex-nowrap gap-2 overflow-x-auto bg-base-200 py-0 sm:justify-center">
      <li className={'border-r-base-base-300 border-r-2 pr-2'}>
        <button onClick={() => navigate(-1)}>
          <div className={'flex flex-col items-center gap-0'}>
            <IoIosArrowBack size={20} />
            <span className={`text-xs `}>Back</span>
          </div>
        </button>
      </li>
      {children}
    </ul>
  );
}
