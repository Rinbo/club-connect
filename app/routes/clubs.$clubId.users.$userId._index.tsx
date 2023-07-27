import { useClubUser } from '~/loader-utils';

export default function ClubUser() {
  const clubUser = useClubUser();

  return (
    <div>
      <pre>{JSON.stringify(clubUser, null, 2)}</pre>
    </div>
  );
}
