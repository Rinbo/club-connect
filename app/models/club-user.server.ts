import { prisma } from '~/db.server';
import type { ClubUser } from '@prisma/client';
import { ClubRole } from '@prisma/client';
import type { Clientify } from '~/misc-utils';
import type { ClientUser } from '~/models/user.server';

export type ClientClubUser = Clientify<ClubUser> & { user: ClientUser };

export async function createClubUser(clubId: string, userId: string) {
  return prisma.clubUser.create({
    data: { userId, clubId, clubRoles: [ClubRole.CLUB_USER] }
  });
}

export async function updateClubUser(clubUserId: string, roles: ClubRole[]) {
  return prisma.clubUser.update({
    where: { id: clubUserId },
    data: { clubRoles: roles }
  });
}
export async function findClubUserByUserId(userId: string) {
  return prisma.clubUser.findMany({
    where: { userId },
    include: { user: true }
  });
}

export async function findClubUserByClubIdAndUserId(clubId: string, userId: string) {
  return prisma.clubUser.findFirst({
    where: { userId, clubId },
    include: { user: true }
  });
}

export async function findClubUsersByClubId(clubId: string) {
  return prisma.clubUser.findMany({
    where: { clubId },
    include: { user: true }
  });
}

export async function findClubUsersByTeamId(teamId: string) {
  return prisma.clubUser.findMany({
    where: { teamUsers: { some: { teamId } } },
    include: { user: true }
  });
}

export async function findClubUsersByNameContains(nameString: string, clubId: string, take: number) {
  return prisma.clubUser.findMany({
    where: {
      user: {
        name: { contains: nameString, mode: 'insensitive' }
      },
      clubId
    },
    include: { user: true },
    take
  });
}
