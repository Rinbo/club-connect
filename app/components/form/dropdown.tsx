type Props = {
  options: string[];
  name: string;
  id: string;
  label: string;
  errors: string[] | null | undefined;
};

export default function DropDown({ options, name, label, id, errors }: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase text-gray-600">
        {label}
      </label>
      <select
        id={id}
        name={name}
        className="mt-1 block h-9 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
      >
        {options.map(option => (
          <option key={option}>{option}</option>
        ))}
      </select>
      {errors?.map(error => (
        <small key={error} className="block text-red-500">
          {error}
        </small>
      ))}
    </div>
  );
}
