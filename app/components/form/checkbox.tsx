type Props = { label: string; id: string; name: string };

export default function CheckBox({ label, id, name }: Props) {
  return (
    <div className="flex items-center">
      <input id={id} name={name} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600" />
      <label htmlFor={name} className="ml-2 block text-sm text-base-content">
        {label}
      </label>
    </div>
  );
}
