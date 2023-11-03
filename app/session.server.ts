import { createCookieSessionStorage, redirect } from '@remix-run/node';
import type { User, UserWithRoles } from '~/models/user.server';
import { getUserById } from '~/models/user.server';

import invariant from 'tiny-invariant';
import { isClubAdmin, isClubOwner, isClubUser, isClubWebmaster, isTeamLeader, isTeamUser, isTeamWebmaster } from '~/security/role-utils';
import { getUserRoles, invalidateAuthorizationCache } from '~/security/authorization.server';
import { TeamRole } from '@prisma/client';

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');
const USER_ID_KEY = 'userId';

type SessionData = {
  userId: string | undefined;
};

export type SessionFlashData = {
  message: string | undefined;
  type: 'error' | 'success' | undefined;
};

export interface ClubUserRoles {
  isUser: boolean;
  isWebmaster: boolean;
  isAdmin: boolean;
  isOwner: boolean;
}

export interface TeamUserRoles {
  roles: TeamRole[];
  isTeamUser: boolean;
  isTeamWebmaster: boolean;
  isTeamLeader: boolean;
}

const sessionStorage = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production'
  }
});

export const { commitSession } = sessionStorage;

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

export async function getUserId(request: Request): Promise<User['id'] | undefined> {
  const session = await getSession(request);
  return session.get(USER_ID_KEY);
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const userId = await getUserId(request);

  if (!userId) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}
export async function requireClubUser(request: Request, clubId: string): Promise<ClubUserRoles> {
  const userId = await requireUserId(request);
  const userRoles = await getUserRoles(userId);

  if (!isClubUser(userRoles.clubRoles, clubId)) {
    throw redirect(`/dashboard`);
  }

  return {
    isUser: isClubUser(userRoles.clubRoles, clubId),
    isWebmaster: isClubWebmaster(userRoles.clubRoles, clubId),
    isAdmin: isClubAdmin(userRoles.clubRoles, clubId),
    isOwner: isClubOwner(userRoles.clubRoles, clubId)
  };
}

export async function requireClubAdmin(request: Request, clubId: string) {
  const userId = await requireUserId(request);
  const userRoles = await getUserRoles(userId);

  if (!isClubAdmin(userRoles.clubRoles, clubId)) {
    throw redirect(`/clubs/${clubId}`);
  }

  return userId;
}

export async function requireClubWebmaster(request: Request, clubId: string) {
  const userId = await requireUserId(request);
  const userRoles = await getUserRoles(userId);

  if (!isClubWebmaster(userRoles.clubRoles, clubId)) {
    throw redirect(`/clubs/${clubId}`, { status: 403 });
  }

  return userId;
}

export async function requireTeamLeader(request: Request, clubId: string, teamId: string) {
  const teamRoles = await getTeamRoles(request, clubId, teamId);

  if (!teamRoles.isTeamLeader) {
    throw redirect(`/clubs/${clubId}/teams/${teamId}`, { status: 403 });
  }
}

export async function requireTeamWebmaster(request: Request, clubId: string, teamId: string) {
  const teamRoles = await getTeamRoles(request, clubId, teamId);

  if (!teamRoles.isTeamWebmaster) {
    throw redirect(`/clubs/${clubId}/teams/${teamId}`, { status: 403 });
  }
}

export async function requireTeamUser(request: Request, clubId: string, teamId: string) {
  const teamRoles = await getTeamRoles(request, clubId, teamId);

  if (!teamRoles.isTeamUser) {
    throw redirect(`/clubs/${clubId}/teams/${teamId}`, { status: 403 });
  }
}

export async function getTeamRoles(request: Request, clubId: string, teamId: string): Promise<TeamUserRoles> {
  const userId = await requireUserId(request);
  const userRoles = await getUserRoles(userId);

  return {
    roles: userRoles.teamRoles.get(teamId) ?? [],
    isTeamUser: isTeamUser(userRoles.teamRoles, teamId) || isClubWebmaster(userRoles.clubRoles, clubId),
    isTeamWebmaster: isTeamWebmaster(userRoles.teamRoles, teamId) || isClubWebmaster(userRoles.clubRoles, clubId),
    isTeamLeader: isTeamLeader(userRoles.teamRoles, teamId) || isClubAdmin(userRoles.clubRoles, clubId)
  };
}

export async function redirectIfSignedIn(request: Request) {
  const userId = await getUserId(request);
  if (userId) throw redirect('/dashboard');
}

export async function createUserSession({
  request,
  user,
  remember,
  redirectTo
}: {
  request: Request;
  user: UserWithRoles;
  remember: boolean;
  redirectTo: string;
}) {
  if (!user) throw new Error('User null or undefined while creating session');

  const session = await getSession(request);

  session.set(USER_ID_KEY, user.id);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined
      })
    }
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  const userId = session.get(USER_ID_KEY);
  if (userId) invalidateAuthorizationCache(userId);

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  });
}
