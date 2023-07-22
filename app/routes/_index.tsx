import type { V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { useOptionalUser } from '~/utils';
import { findClubs } from '~/models/club.server';
import ClubCard from '~/components/club/club-card';

export async function loader() {
  const clubs = await findClubs(15);
  return json({ clubs });
}

export const meta: V2_MetaFunction = () => [{ title: 'Club Connect' }];

export default function Index() {
  const user = useOptionalUser();
  const { clubs } = useLoaderData<typeof loader>();

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative h-screen shadow-xl sm:h-full sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://user-images.githubusercontent.com/1500684/158276320-c46b661b-8eff-4a4d-82c6-cf296c987a12.jpg"
                alt="BB King playing blues on his Gibson 'Lucille' guitar"
              />
              <div className="absolute inset-0 bg-[color:rgba(27,167,254,0.5)] mix-blend-multiply" />
            </div>
            <div className="relative h-full px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-blue-500 drop-shadow-md">Club Connect</span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
                Manage your clubs and members with zero hassle
              </p>
              <div className="mx-auto mt-16 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
                  >
                    Dashboard for {user.name}
                  </Link>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-3 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/signup-club"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
                    >
                      Create a club
                    </Link>
                    <Link
                      to="/join"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
                    >
                      Join a club
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
              <p className="mx-auto mt-6 max-w-lg text-center text-3xl text-white sm:max-w-3xl">borjessons.dev</p>
            </div>
          </div>
        </div>
        <div className={'mt-6 text-center text-xl uppercase'}>Our clubs</div>
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="mb-10 mt-2 flex flex-wrap justify-center gap-4">
            {clubs.map(club => (
              <ClubCard key={club.id} name={club.name} />
            ))}
          </div>
        </div>
      </div>
      <div className={'bottom-0 p-1 text-center sm:absolute'}>borjessons.dev {new Date().getFullYear()}</div>
    </main>
  );
}
