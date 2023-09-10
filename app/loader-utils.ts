import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';

import type { User } from '~/models/user.server';
import type { Club, ClubUser } from '@prisma/client';
import type { ClubUserRoles } from '~/session.server';
import type { ClubNewsItem } from '~/models/club-news.server';
import type { Flash } from '~/hooks/useCustomToast';

export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

const DEFAULT_REDIRECT = '/';

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(to: FormDataEntryValue | string | null | undefined, defaultRedirect: string = DEFAULT_REDIRECT) {
  if (!to || typeof to !== 'string') {
    return defaultRedirect;
  }

  if (!to.startsWith('/') || to.startsWith('//')) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(id: string): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(() => matchingRoutes.find(route => route.id === id), [matchingRoutes, id]);
  return route?.data;
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root');
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function errorFlash(message: string): Flash {
  return { message, type: 'error' };
}

export function successFlash(message: string): Flash {
  return { message, type: 'success' };
}

export function useClub(): Club {
  const data = useMatchesData('routes/clubs.$clubId');

  if (!data || !isClub(data.club)) {
    throw new Error('Club data is missing in club root loader');
  }

  return data.club;
}

export function useClubs(): Club[] {
  const data = useMatchesData('routes/dashboard');

  if (!data || !isClubs(data.clubs)) {
    throw new Error('Clubs data is missing in dashboard root loader');
  }

  return data.clubs;
}

export function useClubUser(): ClubUser & { user: User } {
  const data = useMatchesData('routes/clubs.$clubId.users.$userId');

  if (!data || !isClubUser(data.clubUser)) {
    throw new Error('Clubs data is missing in dashboard root loader');
  }

  return data.clubUser;
}

export function useClubUserRoles(): ClubUserRoles {
  const data = useMatchesData('routes/clubs.$clubId');

  if (!data || !isClubUserRoles(data.clubUserRoles)) {
    throw new Error('Club data is missing in club root loader');
  }

  return data.clubUserRoles;
}

export function useClubNewsItem(): ClubNewsItem {
  const data = useMatchesData('routes/clubs.$clubId.news.$newsId');

  if (!data || !isClubNewsItem(data.newsItem)) {
    throw new Error('Clubs news data is missing in club news root loader');
  }

  return data.newsItem;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error('No user found in root loader');
  }
  return maybeUser;
}

function isUser(user: any): user is User {
  return user && typeof user === 'object' && typeof user.email === 'string';
}

function isClubUser(clubUser: any): clubUser is ClubUser & { user: User } {
  return clubUser && typeof clubUser === 'object' && typeof clubUser.userId === 'string';
}

function isClubUserRoles(clubUserRoles: any): clubUserRoles is ClubUserRoles {
  return clubUserRoles && typeof clubUserRoles === 'object';
}
function isClub(club: any): club is Club {
  return club && typeof club === 'object';
}

function isClubNewsItem(clubNewsItem: any): clubNewsItem is ClubNewsItem {
  return clubNewsItem && typeof clubNewsItem === 'object';
}

function isClubs(clubs: any): clubs is Club[] {
  return clubs && Array.isArray(clubs);
}
