import { ClubRole } from '@prisma/client';
import { CLUB_ROLES_HIERARCHY } from '~/security/authorization.server';

export function isClubAdmin(clubRoleMap: Map<string, ClubRole[]>, clubId: string): boolean {
  return hasRoleOrHigher(getOrDefault(clubRoleMap, clubId), ClubRole.CLUB_ADMIN);
}

export function isClubUser(clubRoleMap: Map<string, ClubRole[]>, clubId: string): boolean {
  return hasRoleOrHigher(getOrDefault(clubRoleMap, clubId), ClubRole.CLUB_USER);
}

export function isClubOwner(clubRoleMap: Map<string, ClubRole[]>, clubId: string): boolean {
  return hasRoleOrHigher(getOrDefault(clubRoleMap, clubId), ClubRole.CLUB_OWNER);
}

export function isClubWebmaster(clubRoleMap: Map<string, ClubRole[]>, clubId: string): boolean {
  return hasRoleOrHigher(getOrDefault(clubRoleMap, clubId), ClubRole.CLUB_WEBMASTER);
}

function getOrDefault(clubRoleMap: Map<string, ClubRole[]>, clubId: string) {
  return clubRoleMap.get(clubId) ?? [];
}

function hasRoleOrHigher(clubRoles: ClubRole[], targetRole: ClubRole) {
  const targetIndex = CLUB_ROLES_HIERARCHY.indexOf(targetRole);

  if (targetIndex === -1) {
    throw new Error(`Invalid role: ${targetRole}`);
  }

  for (let i = targetIndex; i < CLUB_ROLES_HIERARCHY.length; i++) {
    const thisRole = CLUB_ROLES_HIERARCHY[i];
    if (clubRoles.includes(thisRole)) {
      return true;
    }
  }

  return false;
}
