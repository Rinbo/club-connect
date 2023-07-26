import { prisma } from '~/db.server';
import type { Club } from '@prisma/client';

export async function findClubByName(name: Club['name']) {
  return prisma.club.findUnique({ where: { name } });
}

export async function findClubByNameContains(clubQuery: string) {
  return prisma.club.findMany({
    where: {
      name: {
        contains: clubQuery,
        mode: 'insensitive'
      }
    },
    take: 10
  });
}

export async function findClubs(limit: number) {
  return prisma.club.findMany({ take: limit });
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
