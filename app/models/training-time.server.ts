import { prisma } from '~/db.server';

export async function findTrainingTimesByTeamId(teamId: string) {
  return prisma.trainingTime.findMany({ where: { teamId } });
}
