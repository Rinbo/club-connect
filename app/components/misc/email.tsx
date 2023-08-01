import { HiOutlineMail } from 'react-icons/hi';

export default function Email({ email }: { email: string }) {
  return (
    <a href={`mailto:${email}`} className={'flex items-center gap-2'}>
      <HiOutlineMail size={30} />
      <div className={'align-baseline'}>{email}</div>
    </a>
  );
}
