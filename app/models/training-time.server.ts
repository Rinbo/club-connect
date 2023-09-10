import { prisma } from '~/db.server';
import { $Enums } from '.prisma/client';
import WeekDay = $Enums.WeekDay;

export async function findTrainingTimesByTeamId(teamId: string) {
  return prisma.trainingTime.findMany({ where: { teamId } });
}

export async function createTrainingTime(weekDay: WeekDay, startTime: string, endTime: string, location: string, teamId: string) {
  return prisma.trainingTime.create({
    data: { weekDay, startTime, endTime, location, teamId }
  });
}

export async function updateTrainingTime(id: string | undefined, weekDay: WeekDay, startTime: string, endTime: string, location: string) {
  return prisma.trainingTime.update({
    where: { id },
    data: { weekDay, startTime, endTime, location }
  });
}

export async function deleteTrainingTimeById(id: string) {
  return prisma.trainingTime.delete({ where: { id } });
}
