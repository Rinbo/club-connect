import React from 'react';

export type Props = {
  label: string;
  id?: string;
  name?: string;
  placeholder?: string;
  rowNum?: number;
  required?: boolean;
  defaultValue?: string;
  errors?: string[] | null;
  reactRef?: React.RefObject<HTMLInputElement>;
};

export default function TextArea({
  label,
  id,
  name,
  errors,
  defaultValue,
  rowNum = 10,
  placeholder = 'Write something...',
  required = true
}: Props) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <textarea
        id={id}
        aria-placeholder={placeholder}
        name={name}
        rows={rowNum}
        required={required}
        defaultValue={defaultValue}
        className="textarea textarea-bordered"
        placeholder={placeholder}
      ></textarea>
      {errors?.map(error => (
        <small key={error} className="block text-error">
          {error}
        </small>
      ))}
    </div>
  );
}
