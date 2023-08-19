import { useOutletContext } from 'react-router';
import type { TeamContextType } from '~/routes/clubs.$clubId.teams.$teamId';
import React from 'react';

export default function Team() {
  const { team } = useOutletContext<TeamContextType>();

  return (
    <section>
      <div>{JSON.stringify(team, null, 2)}</div>
    </section>
  );
}
