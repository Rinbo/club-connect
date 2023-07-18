import type { Password, User } from '@prisma/client';
import { ClubRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { prisma } from '~/db.server';
import type { PromiseType } from '~/utils';

export type { User } from '@prisma/client';
export type UserWithRoles =
  | PromiseType<ReturnType<typeof verifyLogin>>
  | PromiseType<ReturnType<typeof createOwner>>
  | PromiseType<ReturnType<typeof createUser>>;

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User['email'], password: string, name: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      name,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    },
    include: { clubUsers: true }
  });
}

export async function deleteUserByEmail(email: User['email']) {
  return prisma.user.delete({ where: { email } });
}

export async function createOwner(ownerName: string, email: string, password: string, clubName: string, clubType: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name: ownerName,
      email,
      password: {
        create: {
          hash: hashedPassword
        }
      },
      clubUsers: {
        create: [
          {
            club: {
              create: {
                name: clubName,
                clubType
              }
            },
            clubRoles: [ClubRole.CLUB_USER, ClubRole.CLUB_ADMIN, ClubRole.CLUB_OWNER]
          }
        ]
      }
    },
    include: { clubUsers: true }
  });
}

export async function verifyLogin(email: User['email'], password: Password['hash']) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
      clubUsers: true
    }
  });

  if (!userWithPassword?.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password.hash);

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
