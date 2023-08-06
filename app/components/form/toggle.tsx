import React from 'react';

export type Props = {
  label: string;
  id?: string;
  name?: string;
  defaultChecked?: boolean;
};

export default function Toggle({ label, id, name, defaultChecked = false }: Props) {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input id={id} name={name} type="checkbox" className="toggle toggle-primary" readOnly defaultChecked={defaultChecked} />
      </label>
    </div>
  );
}
