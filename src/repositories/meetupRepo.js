import prisma from '../config/db.js';

export function create(meetupData) {
  return prisma.meetup.create({ data: meetupData });
}

export function getAll(where) {
  return prisma.meetup.findMany({
    where,
    orderBy: { scheduled_time: 'asc' },
  });
}

export function getById(meetupId) {
  return prisma.meetup.findUnique({ where: { meetup_id: meetupId } });
}

export function update(meetupId, meetupData) {
  return prisma.meetup.update({
    where: { meetup_id: meetupId },
    data: meetupData,
  });
}

export function remove(meetupId) {
  return prisma.meetup.delete({ where: { meetup_id: meetupId } });
}
