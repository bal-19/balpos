import { prisma } from "../../../database/prisma.js";

const userWithAccessInclude = {
  role: {
    include: {
      permissions: { include: { permission: true } },
    },
  },
} as const;

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: userWithAccessInclude,
  });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: userWithAccessInclude,
  });
}

export function touchLastLogin(id: string) {
  return prisma.user.update({
    where: { id },
    data: { lastLoginAt: new Date() },
  });
}

export type UserWithAccess = NonNullable<Awaited<ReturnType<typeof findUserByEmail>>>;
