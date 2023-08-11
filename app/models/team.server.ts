import { prisma } from '~/db.server';

export async function findTeamsByClubId(clubId: string, skip: number, take: number) {
  return prisma.team.findMany({
    where: { clubId },
    take,
    skip,
    orderBy: { createdAt: 'desc' }
  });
}
