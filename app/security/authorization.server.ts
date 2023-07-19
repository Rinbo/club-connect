import { findClubUserByUserId } from '~/models/club-user.server';
import type { ClubRole } from '@prisma/client';
import { cache as authorizationCache } from '~/security/cache.server';

type UserRoles = {
  clubRoles: Map<string, ClubRole[]>;
  teamRoles: Map<string, string[]>;
  parentRoles: Map<string, string[]>;
};

const MAX_TTL_SECONDS = 60;

export async function getUserRoles(userId: string): Promise<UserRoles> {
  const cachedRoles = authorizationCache.get<UserRoles>(userId);
  if (cachedRoles) return cachedRoles;

  const clubRoleMap = await getClubUserRoles(userId);

  const roles: UserRoles = {
    clubRoles: clubRoleMap,
    teamRoles: new Map<string, string[]>(),
    parentRoles: new Map<string, string[]>()
  };

  authorizationCache.set<UserRoles>(userId, roles, MAX_TTL_SECONDS);
  return roles;
}

export function invalidateAuthorizationCache(userId: string) {
  authorizationCache.del(userId);
}

async function getClubUserRoles(userId: string) {
  const clubUsers = await findClubUserByUserId(userId);
  const clubRoleMap = new Map<string, ClubRole[]>();

  clubUsers.forEach(clubUser => clubRoleMap.set(clubUser.clubId, clubUser.clubRoles));
  return clubRoleMap;
}
