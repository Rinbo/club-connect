import { prisma } from '~/db.server';
import { findClubUserByClubIdAndUserId } from '~/models/club-user.server';
import type { ClubNews, ClubNewsImageUrls } from '.prisma/client';
import type { ClubUser, User } from '@prisma/client';

export type ClubNewsItem = ClubNews & { imageUrls: ClubNewsImageUrls[]; author: ClubUser & { user: User } };

export async function findClubNewsByClubId(clubId: string, skip: number, take: number) {
  return prisma.clubNews.findMany({
    where: { clubId },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: { imageUrls: true, author: { include: { user: { select: { name: true, imageUrl: true } } } } }
  });
}

export async function findClubNewsById(id: string) {
  return prisma.clubNews.findFirstOrThrow({
    where: { id },
    include: { imageUrls: true, author: { include: { user: true } } }
  });
}

export async function updateClubNews(id: string, title: string, body: string, isPublic: boolean, imageUrls: string[], clubId: string) {
  return prisma.clubNews.update({
    where: { id },
    data: {
      title,
      body,
      isPublic,
      clubId
    }
  });
}

export async function createClubNews(title: string, body: string, isPublic: boolean, imageUrls: string[], clubId: string, userId: string) {
  const clubUser = await findClubUserByClubIdAndUserId(clubId, userId);
  if (!clubUser) throw new Error('ClubUser does not exist');

  return prisma.clubNews.create({
    data: {
      title,
      body,
      isPublic,
      clubId,
      clubUserId: clubUser.id,
      imageUrls: {
        create: imageUrls.map(url => {
          return { url };
        })
      }
    }
  });
}
