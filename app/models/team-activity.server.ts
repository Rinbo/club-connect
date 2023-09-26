import { prisma } from '~/db.server';
import { $Enums } from '.prisma/client';
import TeamActivityType = $Enums.TeamActivityType;

export async function findTeamActivities(teamId: string, skip: number, take: number) {
  return prisma.teamActivity.findMany({
    where: { teamId },
    skip,
    take,
    orderBy: { startTime: 'desc' },
    include: { present: true, coming: true }
  });
}

export async function findTeamActivityById(id: string) {
  return prisma.teamActivity.findFirstOrThrow({
    where: { id },
    include: { coming: { select: { id: true } }, present: { select: { id: true } } }
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

export async function addComingClubUser(id: string, clubUserId: string) {
  return prisma.teamActivity.update({
    where: { id },
    data: { coming: { connect: { id: clubUserId } } }
  });
}

export async function removeComingClubUser(id: string, clubUserId: string) {
  return prisma.teamActivity.update({
    where: { id },
    data: { coming: { connect: { id: clubUserId } } }
  });
}

export async function addPresentClubUser(id: string, clubUserId: string) {
  return prisma.teamActivity.update({
    where: { id },
    data: { present: { connect: { id: clubUserId } } }
  });
}

export async function removePresentClubUser(id: string, clubUserId: string) {
  return prisma.teamActivity.update({
    where: { id },
    data: { present: { connect: { id: clubUserId } } }
  });
}

export async function updateTeamActivity(id: string, data: TeamActivityData) {
  return prisma.teamActivity.update({
    where: { id },
    data: { ...data }
  });
}
