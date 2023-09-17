import React from 'react';

type Props = { id: string; name: string; defaultValue?: string; errors?: string[] | null };

export default function TimeField({ id, name, errors, defaultValue }: Props) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        <span className="label-text">Start time</span>
      </label>
      <input type="time" name={name} id={id} defaultValue={defaultValue} className="input input-bordered inline-flex" />
      {errors?.map(error => (
        <small key={error} className="block text-red-500">
          {error}
        </small>
      ))}
    </div>
  );
}
