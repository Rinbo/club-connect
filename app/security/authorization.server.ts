import { findClubUserByUserId } from '~/models/club-user.server';
import { ClubRole } from '@prisma/client';

export const CLUB_ROLES_HIERARCHY: ClubRole[] = [ClubRole.CLUB_USER, ClubRole.CLUB_WEBMASTER, ClubRole.CLUB_ADMIN, ClubRole.CLUB_OWNER];

type UserRoles = {
  clubRoles: Map<string, ClubRole[]>;
  teamRoles: Map<string, string[]>;
  parentRoles: Map<string, string[]>;
  expires: number;
};

type AuthorizationCache = Map<string, UserRoles>;

const authorizationCache: AuthorizationCache = new Map<string, UserRoles>();

setInterval(() => {
  const now = new Date().getTime();
  for (let [key, value] of authorizationCache.entries()) {
    if (value.expires < now) {
      authorizationCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

export async function getUserRoles(userId: string) {
  const cachedRoles = authorizationCache.get(userId);
  if (cachedRoles) return cachedRoles;

  // TODO fetch team and parent roles when available
  const clubRoleMap = await getClubUserRoles(userId);

  const roles: UserRoles = {
    clubRoles: clubRoleMap,
    teamRoles: new Map<string, string[]>(),
    parentRoles: new Map<string, string[]>(),
    expires: new Date().getTime() + 300 * 1000
  };

  authorizationCache.set(userId, roles);
  return roles;
}

export function invalidateAuthorizationCache(userId: string) {
  authorizationCache.delete(userId);
}

async function getClubUserRoles(userId: string) {
  const clubUsers = await findClubUserByUserId(userId);
  const clubRoleMap = new Map<string, ClubRole[]>();

  clubUsers.forEach(clubUser => clubRoleMap.set(clubUser.clubId, clubUser.clubRoles));
  return clubRoleMap;
}
