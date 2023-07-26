import { Link } from '@remix-run/react';
import { useClubs } from '~/loader-utils';

export { ErrorBoundary } from '~/error-boundry';

export default function () {
  const clubs = useClubs();

  return (
    <div className={'container mx-auto p-2 sm:p-4'}>
      <div className={'card sm:w-64'}>
        <div className={'flex flex-col gap-2'}>
          {clubs.length === 0 && <div>You have no clubs :(</div>}

          {clubs.map((club, index) => (
            <Link key={index} to={`/clubs/${club.id}`} className={'btn'}>
              {club.name}
            </Link>
          ))}

          <Link to="/notes" className="btn">
            Notes
          </Link>
        </div>
      </div>
    </div>
  );
}
