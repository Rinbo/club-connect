import { prisma } from '~/db.server';

export async function findClubUserByUserId(userId: string) {
  return prisma.clubUser.findMany({
    where: { userId }
  });
}
