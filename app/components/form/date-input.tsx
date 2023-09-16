import React from 'react';

export type Props = {
  label: string;
  id?: string;
  name?: string;
  required?: boolean;
  defaultValue?: string;
  errors?: string[] | null;
  reactRef?: React.RefObject<HTMLInputElement>;
};

export default function DateInput({ id, name, label, defaultValue, errors, required = true }: Props) {
  return (
    <div>
      <label htmlFor={id} className="label">
        <span className={'label-text'}>{label}</span>
      </label>
      <input
        className="input input-bordered w-full"
        type={'datetime-local'}
        id={id}
        name={name}
        defaultValue={defaultValue && new Date(defaultValue).toLocaleString()}
        required={required}
      />
      {errors?.map(error => (
        <small key={error} className="block text-red-500">
          {error}
        </small>
      ))}
    </div>
  );
}
