import { prisma } from '~/db.server';
import type { AddMemberModel } from '~/routes/clubs.$clubId.teams.$teamId.members/route';

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

export async function deleteTeam(id: string) {
  return prisma.team.delete({ where: { id } });
}

/** Team Members **/

export async function createTeamMembers(teamMembers: AddMemberModel[], teamId: string) {
  return prisma.teamUser.createMany({
    data: teamMembers.map(member => ({ clubUserId: member.clubUserId, teamRoles: [member.teamRole], teamId }))
  });
}
export async function getTeamUsersByTeamId(teamId: string) {
  return prisma.teamUser.findMany({ where: { teamId }, include: { clubUser: { include: { user: true } } } });
}

export async function deleteTeamMembers(memberIds: string[], teamId: string) {
  return prisma.teamUser.deleteMany({
    where: { teamId, id: { in: memberIds } }
  });
}
