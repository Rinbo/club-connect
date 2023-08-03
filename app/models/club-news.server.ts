import { prisma } from '~/db.server';

export async function findClubNewsByClubId(clubId: string, skip: number, take: number) {
  return prisma.clubNews.findMany({
    where: { clubId },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: { author: { include: { user: { select: { name: true, imageUrl: true } } } } }
  });
}

export async function createClubNews(title: string, body: string, isPublic: boolean, clubId: string, clubUserId: string) {
  return prisma.clubNews.create({ data: { title, body, isPublic, clubId, clubUserId } });
}
