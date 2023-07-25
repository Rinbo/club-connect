import { prisma } from '~/db.server';

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
