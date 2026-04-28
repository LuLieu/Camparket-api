import prisma from '../config/db.js';

export function getUserById(userId) {
  return prisma.user.findUnique({ where: { user_id: userId } });
}

export function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export function getUserByUsernameOrEmail(username, email) {
  return prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
}

export function createUser(userData) {
  return prisma.user.create({ data: userData });
}
