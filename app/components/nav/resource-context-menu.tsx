import React from 'react';
import { Link, useNavigate } from '@remix-run/react';
import { IoIosArrowBack, IoMdAddCircleOutline } from 'react-icons/io';
import { AiOutlineMail } from 'react-icons/ai';

type Props = {
  children?: React.ReactNode;
  backButton?: boolean;
  animate?: boolean;
};
export default function ResourceContextMenu({ children, backButton, animate = true }: Props) {
  const navigate = useNavigate();
  return (
    <ul
      className={`${
        animate && 'menu-animate-down'
      } no-scrollbar menu rounded-box menu-horizontal menu-xs mb-1 flex-nowrap gap-2 overflow-x-auto bg-base-200 py-0 sm:justify-center lg:w-full`}
    >
      {backButton && (
        <li onClick={() => navigate(-1)}>
          <div className={'flex flex-col items-center gap-0'}>
            <IoIosArrowBack size={20} />
            <span className={`text-xs `}>Back</span>
          </div>
        </li>
      )}
      {children}
    </ul>
  );
}

export function AddLink({ to }: { to: string }) {
  return (
    <li>
      <Link to={to}>
        <div className={'flex flex-col items-center gap-0'}>
          <IoMdAddCircleOutline size={20} />
          <span className={`text-xs `}>Add</span>
        </div>
      </Link>
    </li>
  );
}
export function NotifyLink({ to }: { to: string }) {
  return (
    <li>
      <Link to={to}>
        <div className={'flex flex-col items-center gap-0'}>
          <AiOutlineMail size={20} />
          <span className={`text-xs`}>Notify</span>
        </div>
      </Link>
    </li>
  );
}
