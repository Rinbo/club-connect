import React from 'react';

export type Props = {
  label: string;
  id?: string;
  name?: string;
  accept?: string;
  multiple?: boolean;
};

export default function FileInput({ label, id, name, accept, multiple = false }: Props) {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type="file"
        name={name}
        id={id}
        accept={accept}
        multiple={multiple}
        className="file-input file-input-bordered w-full max-w-xs"
      />
    </div>
  );
}
