import { prisma } from '~/db.server';

export async function findTeamsByClubId(clubId: string, skip: number, take: number) {
  return prisma.team.findMany({
    where: { clubId },
    take,
    skip,
    orderBy: { createdAt: 'desc' }
  });
}

export async function getTeamById(id: string) {
  return prisma.team.findFirstOrThrow({ where: { id } });
}

export async function createTeam(name: string, clubId: string) {
  return prisma.team.create({
    data: { name, clubId }
  });
}
