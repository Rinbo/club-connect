const SIZE_MAP = {
  xs: 'select-xs',
  sm: 'select-sm',
  lg: 'select-lg'
};

type Size = keyof typeof SIZE_MAP;

type Props = {
  options: string[];
  name: string;
  id: string;
  label?: string;
  size?: Size;
  defaultValue?: string;
  nonSelectableMessage?: string;
  errors?: string[] | null | undefined;
};

export default function DropDown({ options, name, label, id, size, defaultValue, nonSelectableMessage, errors }: Props) {
  return (
    <div className={'form-control'}>
      {label && (
        <label htmlFor={id} className="label">
          <span>{label}</span>
        </label>
      )}
      <select
        id={id}
        name={name}
        defaultValue={defaultValue || 'DEFAULT'}
        className={`select select-bordered w-full ${size && SIZE_MAP[size]}`}
      >
        {nonSelectableMessage && (
          <option value={'DEFAULT'} disabled>
            {nonSelectableMessage}
          </option>
        )}
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
