import { prisma } from '~/db.server';
import { $Enums } from '.prisma/client';
import TeamActivityType = $Enums.TeamActivityType;

export async function findTeamActivities(teamId: string, skip: number, take: number) {
  return prisma.teamActivity.findMany({
    where: { teamId },
    skip,
    take,
    orderBy: { startTime: 'desc' }
  });
}

export async function findTeamActivityById(id: string) {
  return prisma.teamActivity.findFirstOrThrow({
    where: { id }
  });
}

type TeamActivityData = { type: TeamActivityType; location: string; description?: string | undefined; startTime: Date; endTime: Date };

export async function createTeamActivity(teamId: string, data: TeamActivityData) {
  return prisma.teamActivity.create({
    data: { teamId, ...data }
  });
}

export async function updateTeamActivity(id: string, data: TeamActivityData) {
  return prisma.teamActivity.update({
    where: { id },
    data: { ...data }
  });
}
