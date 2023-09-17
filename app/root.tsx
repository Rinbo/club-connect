import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useNavigation } from '@remix-run/react';

import { getUser } from '~/session.server';
import stylesheet from '~/tailwind.css';
import { Toaster } from 'react-hot-toast';
import React from 'react';
import { cx } from '~/misc-utils';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : [])
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};

export default function App() {
  return (
    <html lang="en" className="h-full" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Toaster />
        <GlobalLoading />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function GlobalLoading() {
  const navigation = useNavigation();
  const active = React.useMemo(() => navigation.state !== 'idle', [navigation]);

  /*return <progress hidden={!active} className="progress progress-info fixed w-full" />;*/
  return (
    <div
      role="progressbar"
      aria-valuetext={active ? 'Loading' : undefined}
      aria-hidden={!active}
      className={cx(
        'pointer-events-none fixed bottom-2 left-0 z-50 p-4 transition-all duration-500 ease-out',
        active ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <svg className="h-7 w-7 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em">
        <circle className="stroke-blue-600/25" cx={12} cy={12} r={10} strokeWidth={4} />
        <path
          className="fill-blue-600"
          d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}
