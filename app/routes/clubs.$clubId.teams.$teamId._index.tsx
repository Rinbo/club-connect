import { useOutletContext } from 'react-router';
import type { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId';

export default function Team() {
  const { team } = useOutletContext<TeamContextType>();

  return <section className={'py-4'}>{JSON.stringify(team, null, 2)}</section>;
}
