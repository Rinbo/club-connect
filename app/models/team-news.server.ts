import { prisma } from '~/db.server';
import { findClubUserByClubIdAndUserId } from '~/models/club-user.server';

export async function findClubNews(clubId: string, teamId: string, skip: number, take: number) {
  return prisma.teamNews.findMany({
    where: { teamId, team: { clubId: clubId } },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: { imageUrls: true, author: { include: { user: { select: { name: true, imageUrl: true } } } } }
  });
}

export async function createTeamNews(title: string, body: string, clubId: string, teamId: string, userId: string) {
  const clubUser = await findClubUserByClubIdAndUserId(clubId, userId);
  if (!clubUser) throw new Error('ClubUser does not exist');

  return prisma.teamNews.create({
    data: {
      title,
      body,
      clubUserId: clubUser.id,
      teamId
    }
  });
}

/** Team news image urls */

export async function createTeamNewsImages(urls: string[], teamNewsId: string) {
  return prisma.teamNewsImageUrl.createMany({
    data: urls.map(url => ({ url, teamNewsId }))
  });
}
