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

export async function createTeam(name: string, description: string, clubId: string) {
  return prisma.team.create({
    data: { name, description, clubId }
  });
}

export async function updateTeam(id: string, name: string, description: string) {
  return prisma.team.update({
    where: { id },
    data: { name, description }
  });
}
