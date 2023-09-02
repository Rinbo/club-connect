import { findClubUserByUserId } from '~/models/club-user.server';
import type { ClubRole } from '@prisma/client';
import { cache as authorizationCache } from '~/security/cache.server';
import { findTeamUsersByUserId } from '~/models/team.server';
import type { TeamRole } from '.prisma/client';

type UserRoles = {
  clubRoles: Map<string, ClubRole[]>;
  teamRoles: Map<string, TeamRole[]>;
  parentRoles: Map<string, string[]>;
};

const MAX_TTL_SECONDS = 60;

export async function getUserRoles(userId: string): Promise<UserRoles> {
  const cachedRoles = authorizationCache.get<UserRoles>(userId);
  if (cachedRoles) return cachedRoles;

  const clubRoleMap = await getClubUserRoles(userId);
  const teamUserMap = await getTeamUserRoles(userId);

  const roles: UserRoles = {
    clubRoles: clubRoleMap,
    teamRoles: teamUserMap,
    parentRoles: new Map<string, string[]>()
  };

  authorizationCache.set<UserRoles>(userId, roles, MAX_TTL_SECONDS);
  return roles;
}

export function invalidateAuthorizationCache(userId: string) {
  authorizationCache.del(userId);
}

async function getTeamUserRoles(userId: string) {
  const teamUsers = await findTeamUsersByUserId(userId);
  const teamUserMap = new Map<string, TeamRole[]>();

  teamUsers.forEach(teamUser => teamUserMap.set(teamUser.teamId, teamUser.teamRoles));
  return teamUserMap;
}

async function getClubUserRoles(userId: string) {
  const clubUsers = await findClubUserByUserId(userId);
  const clubRoleMap = new Map<string, ClubRole[]>();

  clubUsers.forEach(clubUser => clubRoleMap.set(clubUser.clubId, clubUser.clubRoles));
  return clubRoleMap;
}
