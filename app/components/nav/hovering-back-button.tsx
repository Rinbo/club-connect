import { useNavigate } from '@remix-run/react';
import { IoIosArrowBack } from 'react-icons/io';
import React from 'react';

export default function HoveringBackButton() {
  const navigate = useNavigate();

  return (
    <div className={'absolute left-1 top-1 z-50'}>
      <button onClick={() => navigate(-1)} className={'btn btn-circle btn-sm shadow-lg'}>
        <IoIosArrowBack size={20} />
      </button>
    </div>
  );
}
