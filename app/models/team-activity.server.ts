import { prisma } from '~/db.server';
import { $Enums } from '.prisma/client';
import { NotificationStatus } from '@prisma/client';
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
    where: { id },
    include: { userActivityPresence: { select: { clubUserId: true } }, userActivityIntent: { select: { clubUserId: true } } }
  });
}

export async function deleteTeamActivity(id: string) {
  return prisma.teamActivity.delete({
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

export async function updateNotificationStatus(id: string, notificationStatus: NotificationStatus) {
  return prisma.teamActivity.update({
    where: { id },
    data: { notificationStatus }
  });
}
