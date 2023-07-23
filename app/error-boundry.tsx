import { isRouteErrorResponse, Link, useRouteError } from '@remix-run/react';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className={'flex h-full items-center justify-center'}>
        <div className={'flex flex-col items-center justify-center gap-2 rounded-2xl border p-6'}>
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
          <Link to={'/dashboard'} className={'btn inline-flex'}>
            Go back to dashboard
          </Link>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className={'flex h-full items-center justify-center'}>
        <div className={'flex flex-col items-center justify-center gap-2 overflow-x-scroll rounded-2xl border p-6'}>
          <h1 className={'text-xl'}>Error</h1>
          <p className={'font-bold'}>{error.message}</p>
          <p>The stack trace is:</p>
          <pre className={'w-60 sm:w-auto'}>{error.stack}</pre>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
