import { isClubAdmin, isClubOwner, isClubUser, isClubWebmaster, isTeamLeader, isTeamUser, isTeamWebmaster } from '~/security/role-utils';
import { ClubRole, TeamRole } from '@prisma/client';

const ID = '0001';
const WRONG_ID = '0002';
const ALL_CLUB_ROLES: ClubRole[] = [ClubRole.CLUB_ADMIN, ClubRole.CLUB_USER, ClubRole.CLUB_OWNER, ClubRole.CLUB_WEBMASTER];
const ALL_TEAM_ROLES: TeamRole[] = [TeamRole.TEAM_LEADER, TeamRole.TEAM_WEBMASTER, TeamRole.TEAM_PLAYER, TeamRole.TEAM_PARENT];

function createRoleMap<T>(roles: T[]) {
  const map = new Map<string, T[]>();
  map.set(ID, roles);
  return map;
}

test('isClubOwner test', () => {
  expect(isClubOwner(createRoleMap(ALL_CLUB_ROLES), ID)).toBe(true);

  expect(isClubOwner(createRoleMap([ClubRole.CLUB_ADMIN]), WRONG_ID)).toBe(false);
  expect(isClubOwner(createRoleMap(ALL_CLUB_ROLES), WRONG_ID)).toBe(false);
});

test('isClubAdmin test', () => {
  expect(isClubAdmin(createRoleMap(ALL_CLUB_ROLES), ID)).toBe(true);
  expect(isClubAdmin(createRoleMap([ClubRole.CLUB_OWNER]), ID)).toBe(true);
  expect(isClubAdmin(createRoleMap([ClubRole.CLUB_ADMIN]), ID)).toBe(true);

  expect(isClubAdmin(createRoleMap([ClubRole.CLUB_WEBMASTER]), ID)).toBe(false);
  expect(isClubAdmin(createRoleMap(ALL_CLUB_ROLES), WRONG_ID)).toBe(false);
});

test('isClubWebmaster test', () => {
  expect(isClubWebmaster(createRoleMap(ALL_CLUB_ROLES), ID)).toBe(true);
  expect(isClubWebmaster(createRoleMap([ClubRole.CLUB_OWNER]), ID)).toBe(true);
  expect(isClubWebmaster(createRoleMap([ClubRole.CLUB_ADMIN]), ID)).toBe(true);
  expect(isClubWebmaster(createRoleMap([ClubRole.CLUB_WEBMASTER]), ID)).toBe(true);

  expect(isClubWebmaster(createRoleMap([ClubRole.CLUB_USER]), ID)).toBe(false);
  expect(isClubWebmaster(createRoleMap(ALL_CLUB_ROLES), WRONG_ID)).toBe(false);
});

test('isClubUser test', () => {
  expect(isClubUser(createRoleMap(ALL_CLUB_ROLES), ID)).toBe(true);
  expect(isClubUser(createRoleMap([ClubRole.CLUB_OWNER]), ID)).toBe(true);
  expect(isClubUser(createRoleMap([ClubRole.CLUB_ADMIN]), ID)).toBe(true);
  expect(isClubUser(createRoleMap([ClubRole.CLUB_WEBMASTER]), ID)).toBe(true);
  expect(isClubUser(createRoleMap([ClubRole.CLUB_USER]), ID)).toBe(true);

  expect(isClubUser(createRoleMap([]), ID)).toBe(false);
  expect(isClubUser(createRoleMap(ALL_CLUB_ROLES), WRONG_ID)).toBe(false);
});

test('isTeamLeader test', () => {
  expect(isTeamLeader(createRoleMap(ALL_TEAM_ROLES), ID)).toBe(true);

  expect(isTeamLeader(createRoleMap([TeamRole.TEAM_WEBMASTER]), WRONG_ID)).toBe(false);
  expect(isTeamLeader(createRoleMap(ALL_TEAM_ROLES), WRONG_ID)).toBe(false);
});

test('isTeamWebmaster test', () => {
  expect(isTeamWebmaster(createRoleMap(ALL_TEAM_ROLES), ID)).toBe(true);
  expect(isTeamWebmaster(createRoleMap([TeamRole.TEAM_LEADER]), ID)).toBe(true);
  expect(isTeamWebmaster(createRoleMap([TeamRole.TEAM_WEBMASTER]), ID)).toBe(true);

  expect(isTeamWebmaster(createRoleMap([TeamRole.TEAM_PLAYER]), ID)).toBe(false);
  expect(isTeamWebmaster(createRoleMap(ALL_TEAM_ROLES), WRONG_ID)).toBe(false);
});

test('isTeamUser test', () => {
  expect(isTeamUser(createRoleMap(ALL_TEAM_ROLES), ID)).toBe(true);
  expect(isTeamUser(createRoleMap([TeamRole.TEAM_LEADER]), ID)).toBe(true);
  expect(isTeamUser(createRoleMap([TeamRole.TEAM_WEBMASTER]), ID)).toBe(true);
  expect(isTeamUser(createRoleMap([TeamRole.TEAM_PLAYER]), ID)).toBe(true);
  expect(isTeamUser(createRoleMap([TeamRole.TEAM_PARENT]), ID)).toBe(true);

  expect(isTeamUser(createRoleMap([]), ID)).toBe(false);
  expect(isTeamUser(createRoleMap(ALL_TEAM_ROLES), WRONG_ID)).toBe(false);
});
