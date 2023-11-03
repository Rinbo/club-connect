import { useClub, useClubUser } from '~/loader-utils';

export default function Club() {
  const club = useClub();
  const clubUser = useClubUser();

  return (
    <div>
      <div className={'my-4'}>
        <pre>USER: {JSON.stringify(clubUser, null, 2)}</pre>
        <hr className={'my-4'} />
        <pre>CLUB: {JSON.stringify(club, null, 2)}</pre>
      </div>
    </div>
  );
}
