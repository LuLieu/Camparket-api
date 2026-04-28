import prisma from '../config/db.js';

const listingIncludes = { images: true, category: true };

export function create(listingData) {
  return prisma.listing.create({
    data: listingData,
    include: listingIncludes,
  });
}

export function getAll(where) {
  return prisma.listing.findMany({
    where,
    orderBy: { created_at: 'desc' },
    include: listingIncludes,
  });
}

export function getById(listingId) {
  return prisma.listing.findUnique({
    where: { listing_id: listingId },
    include: listingIncludes,
  });
}

export function update(listingId, listingData) {
  return prisma.listing.update({
    where: { listing_id: listingId },
    data: listingData,
    include: listingIncludes,
  });
}

export function remove(listingId) {
  return prisma.listing.delete({ where: { listing_id: listingId } });
}
