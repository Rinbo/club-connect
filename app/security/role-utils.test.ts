import { isClubAdmin, isClubOwner, isClubUser, isClubWebmaster } from '~/security/role-utils';
import { ClubRole } from '@prisma/client';

const CLUB_ID = '0001';
const WRONG_CLUB_ID = '0002';
const ALL_ROLES = [ClubRole.CLUB_ADMIN, ClubRole.CLUB_USER, ClubRole.CLUB_OWNER, ClubRole.CLUB_WEBMASTER];

function createRoleMap(roles: ClubRole[]) {
  const map = new Map<string, ClubRole[]>();
  map.set(CLUB_ID, roles);
  return map;
}

test('isClubOwner test', () => {
  expect(isClubOwner(createRoleMap(ALL_ROLES), CLUB_ID)).toBe(true);

  expect(isClubOwner(createRoleMap([ClubRole.CLUB_ADMIN]), WRONG_CLUB_ID)).toBe(false);
  expect(isClubOwner(createRoleMap(ALL_ROLES), WRONG_CLUB_ID)).toBe(false);
});

test('isClubAdmin test', () => {
  expect(isClubAdmin(createRoleMap(ALL_ROLES), CLUB_ID)).toBe(true);
  expect(isClubAdmin(createRoleMap([ClubRole.CLUB_OWNER]), CLUB_ID)).toBe(true);
  expect(isClubAdmin(createRoleMap([ClubRole.CLUB_ADMIN]), CLUB_ID)).toBe(true);

  expect(isClubAdmin(createRoleMap([ClubRole.CLUB_WEBMASTER]), CLUB_ID)).toBe(false);
  expect(isClubAdmin(createRoleMap(ALL_ROLES), WRONG_CLUB_ID)).toBe(false);
});

test('isClubWebmaster test', () => {
  expect(isClubWebmaster(createRoleMap(ALL_ROLES), CLUB_ID)).toBe(true);
  expect(isClubWebmaster(createRoleMap([ClubRole.CLUB_OWNER]), CLUB_ID)).toBe(true);
  expect(isClubWebmaster(createRoleMap([ClubRole.CLUB_ADMIN]), CLUB_ID)).toBe(true);
  expect(isClubWebmaster(createRoleMap([ClubRole.CLUB_WEBMASTER]), CLUB_ID)).toBe(true);

  expect(isClubWebmaster(createRoleMap([ClubRole.CLUB_USER]), CLUB_ID)).toBe(false);
  expect(isClubWebmaster(createRoleMap(ALL_ROLES), WRONG_CLUB_ID)).toBe(false);
});

test('isClubUser test', () => {
  expect(isClubUser(createRoleMap(ALL_ROLES), CLUB_ID)).toBe(true);
  expect(isClubUser(createRoleMap([ClubRole.CLUB_OWNER]), CLUB_ID)).toBe(true);
  expect(isClubUser(createRoleMap([ClubRole.CLUB_ADMIN]), CLUB_ID)).toBe(true);
  expect(isClubUser(createRoleMap([ClubRole.CLUB_WEBMASTER]), CLUB_ID)).toBe(true);
  expect(isClubUser(createRoleMap([ClubRole.CLUB_USER]), CLUB_ID)).toBe(true);

  expect(isClubUser(createRoleMap([]), CLUB_ID)).toBe(false);
  expect(isClubUser(createRoleMap(ALL_ROLES), WRONG_CLUB_ID)).toBe(false);
});
