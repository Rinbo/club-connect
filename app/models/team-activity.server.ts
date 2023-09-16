import { prisma } from '~/db.server';
import { $Enums } from '.prisma/client';
import TeamActivityType = $Enums.TeamActivityType;

export async function findTeamActivity(teamId: string, skip: number, take: number) {
  return prisma.teamActivity.findMany({
    where: { teamId },
    skip,
    take,
    orderBy: { startTime: 'desc' }
  });
}

type CreateData = { type: TeamActivityType; location: string; description?: string | undefined; startTime: Date; endTime: Date };

export async function createTeamActivity(teamId: string, data: CreateData) {
  return prisma.teamActivity.create({
    data: { teamId, ...data }
  });
}
