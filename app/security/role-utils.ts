import { ClubRole, TeamRole } from '@prisma/client';

export const CLUB_ROLES_HIERARCHY: ClubRole[] = [ClubRole.CLUB_USER, ClubRole.CLUB_WEBMASTER, ClubRole.CLUB_ADMIN, ClubRole.CLUB_OWNER];
export const TEAM_ROLES_HIERARCHY: TeamRole[] = [TeamRole.TEAM_PARENT, TeamRole.TEAM_PLAYER, TeamRole.TEAM_WEBMASTER, TeamRole.TEAM_LEADER];

export function isClubAdmin(clubRoleMap: Map<string, ClubRole[]>, clubId: string): boolean {
  return hasRoleOrHigher(getOrDefault(clubRoleMap, clubId), ClubRole.CLUB_ADMIN, CLUB_ROLES_HIERARCHY);
}

export function isClubUser(clubRoleMap: Map<string, ClubRole[]>, clubId: string): boolean {
  return hasRoleOrHigher(getOrDefault(clubRoleMap, clubId), ClubRole.CLUB_USER, CLUB_ROLES_HIERARCHY);
}

export function isClubOwner(clubRoleMap: Map<string, ClubRole[]>, clubId: string): boolean {
  return hasRoleOrHigher(getOrDefault(clubRoleMap, clubId), ClubRole.CLUB_OWNER, CLUB_ROLES_HIERARCHY);
}

export function isClubWebmaster(clubRoleMap: Map<string, ClubRole[]>, clubId: string): boolean {
  return hasRoleOrHigher(getOrDefault(clubRoleMap, clubId), ClubRole.CLUB_WEBMASTER, CLUB_ROLES_HIERARCHY);
}

export function isTeamLeader(teamRoleMap: Map<string, TeamRole[]>, teamId: string): boolean {
  return hasRoleOrHigher(getOrDefault(teamRoleMap, teamId), TeamRole.TEAM_LEADER, TEAM_ROLES_HIERARCHY);
}
export function isTeamWebmaster(teamRoleMap: Map<string, TeamRole[]>, teamId: string): boolean {
  return hasRoleOrHigher(getOrDefault(teamRoleMap, teamId), TeamRole.TEAM_WEBMASTER, TEAM_ROLES_HIERARCHY);
}
export function isTeamUser(teamRoleMap: Map<string, TeamRole[]>, teamId: string): boolean {
  return hasRoleOrHigher(getOrDefault(teamRoleMap, teamId), TeamRole.TEAM_PARENT, TEAM_ROLES_HIERARCHY);
}

function getOrDefault<T>(roleMap: Map<string, T[]>, id: string): T[] {
  return roleMap.get(id) ?? [];
}

function hasRoleOrHigher<T>(roles: T[], targetRole: T, hierarchy: T[]) {
  const targetIndex = hierarchy.indexOf(targetRole);

  if (targetIndex === -1) {
    throw new Error(`Invalid role: ${targetRole}`);
  }

  for (let i = targetIndex; i < hierarchy.length; i++) {
    const thisRole = hierarchy[i];
    if (roles.includes(thisRole)) {
      return true;
    }
  }

  return false;
}
