import prisma from '../config/db.js';

export function create(messageData) {
  return prisma.message.create({ data: messageData });
}

export function getAll(where) {
  return prisma.message.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });
}

export function getById(messageId) {
  return prisma.message.findUnique({ where: { message_id: messageId } });
}

export function update(messageId, messageData) {
  return prisma.message.update({
    where: { message_id: messageId },
    data: messageData,
  });
}

export function remove(messageId) {
  return prisma.message.delete({ where: { message_id: messageId } });
}
