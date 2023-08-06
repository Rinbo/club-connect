import React, { useRef } from 'react';
import { MdPlaylistRemove } from 'react-icons/md';

export type Props = {
  label: string;
  id?: string;
  name?: string;
  accept?: string;
  multiple?: boolean;
};

export default function FileInput({ label, id, name, accept, multiple = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className={'flex flex-row gap-1 py-1'}>
        <input
          type="file"
          name={name}
          id={id}
          accept={accept}
          multiple={multiple}
          ref={inputRef}
          className="file-input file-input-bordered w-full max-w-xs"
        />
        <button type={'button'} className={'btn btn-circle btn-ghost'} onClick={clearInput}>
          <MdPlaylistRemove size={30} />
        </button>
      </div>
    </div>
  );
}
