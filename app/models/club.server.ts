import { prisma } from '~/db.server';
import type { Club } from '@prisma/client';

export async function findClubByName(name: Club['name']) {
  return prisma.club.findUnique({ where: { name } });
}

export async function findClubById(id: Club['id']) {
  return prisma.club.findUnique({ where: { id } });
}

export async function findAllClubsByUserId(userId: string) {
  return prisma.club.findMany({
    where: {
      clubUsers: {
        some: { userId }
      }
    }
  });
}
