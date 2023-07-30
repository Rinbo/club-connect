type Props = {
  options: string[];
  name: string;
  id: string;
  label: string;
  defaultValue?: string;
  errors: string[] | null | undefined;
};

export default function DropDown({ options, name, label, id, defaultValue, errors }: Props) {
  return (
    <div className={'form-control'}>
      <label htmlFor={id} className="label">
        <span>{label}</span>
      </label>
      <select id={id} name={name} defaultValue={defaultValue} className="select select-bordered w-full">
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
