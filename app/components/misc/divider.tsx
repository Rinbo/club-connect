export default function Divider({ text }: { text: string }) {
  return (
    <div className="inline-flex w-full items-center justify-center">
      <hr className="my-4 h-px w-64 border-0 bg-gray-200" />
      <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 uppercase text-gray-900">{text}</span>
    </div>
  );
}
