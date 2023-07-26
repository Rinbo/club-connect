import { prisma } from '~/db.server';
import { ClubRole } from '@prisma/client';

export async function createClubUser(clubId: string, userId: string) {
  return prisma.clubUser.create({
    data: { userId, clubId, clubRoles: [ClubRole.CLUB_USER] }
  });
}
export async function findClubUserByUserId(userId: string) {
  return prisma.clubUser.findMany({
    where: { userId },
    include: { user: true }
  });
}

export async function findClubUsersByClubId(clubId: string) {
  return prisma.clubUser.findMany({
    where: { clubId },
    include: { user: true }
  });
}
