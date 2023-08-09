import React from 'react';

export type Props = {
  label: string;
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  autoComplete?: string;
  errors?: string[] | null;
  reactRef?: React.RefObject<HTMLInputElement>;
};

export default function TextInput({ label, id, name, type, placeholder, required, defaultValue, autoComplete, errors, reactRef }: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase text-gray-600">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={errors ? true : undefined}
        aria-describedby={`${name}-error`}
        ref={reactRef}
        className="input input-bordered mt-1 w-full"
      />
      {errors?.map(error => (
        <small key={error} className="block text-red-500">
          {error}
        </small>
      ))}
    </div>
  );
}
