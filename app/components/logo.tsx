import logo from '~/resources/app-logo.svg';

export default function AppLogo({ className = 'h-28 w-28 fill-primary' }: { className?: string }) {
  return <img alt={'logo'} className={className} src={logo} />;
}
