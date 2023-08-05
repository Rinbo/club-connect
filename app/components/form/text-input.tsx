import React from 'react';

export type Props = {
  label: string;
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  errors?: string[] | null;
  reactRef?: React.RefObject<HTMLInputElement>;
};

export default function TextInput({ label, id, name, type, placeholder, required, autoComplete, errors, reactRef }: Props) {
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
        aria-invalid={errors ? true : undefined}
        aria-describedby={`${name}-error`}
        ref={reactRef}
        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
      />
      {errors?.map(error => (
        <small key={error} className="block text-red-500">
          {error}
        </small>
      ))}
    </div>
  );
}
