import ApiError from '../utils/ApiError.js';
import * as listingRepo from '../repositories/listingRepo.js';
import * as meetupRepo from '../repositories/meetupRepo.js';

const statuses = ['proposed', 'accepted', 'completed', 'canceled'];

function parseId(id) {
  const value = Number(id);
  if (!Number.isInteger(value) || value <= 0) throw new ApiError(400, 'Invalid ID format');
  return value;
}

async function requireMeetup(id) {
  const meetup = await meetupRepo.getById(parseId(id));
  if (!meetup) throw new ApiError(404, 'Meetup not found');
  return meetup;
}

function ensureParticipantOrAdmin(user, meetup) {
  if (user.role !== 'admin' && meetup.buyer_id !== user.user_id && meetup.seller_id !== user.user_id) {
    throw new ApiError(403, 'User not associated with meetup');
  }
}

function validatePayload(data, partial = false) {
  for (const field of ['listing_id', 'location', 'scheduled_time']) {
    if (!partial && !data[field]) throw new ApiError(400, `${field} is required`);
  }
  if (data.status !== undefined && !statuses.includes(data.status)) {
    throw new ApiError(400, 'status is invalid');
  }
  if (data.scheduled_time !== undefined && Number.isNaN(Date.parse(data.scheduled_time))) {
    throw new ApiError(400, 'scheduled_time must be a valid date');
  }
}

export async function createMeetup(user, data) {
  validatePayload(data);
  const listing = await listingRepo.getById(parseId(data.listing_id));
  if (!listing) throw new ApiError(404, 'Listing not found');
  if (listing.seller_id === user.user_id) throw new ApiError(400, 'Seller cannot request a meetup for own listing');

  return meetupRepo.create({
    listing_id: listing.listing_id,
    buyer_id: user.user_id,
    seller_id: listing.seller_id,
    location: data.location,
    scheduled_time: new Date(data.scheduled_time),
    status: data.status || 'proposed',
    notes: data.notes,
  });
}

export async function listMeetups(user) {
  const where = user.role === 'admin'
    ? {}
    : { OR: [{ buyer_id: user.user_id }, { seller_id: user.user_id }] };

  return meetupRepo.getAll(where);
}

export async function getMeetup(user, id) {
  const meetup = await requireMeetup(id);
  ensureParticipantOrAdmin(user, meetup);
  return meetup;
}

export async function updateMeetup(user, id, data) {
  const meetup = await requireMeetup(id);
  ensureParticipantOrAdmin(user, meetup);
  validatePayload(data, true);
  return meetupRepo.update(meetup.meetup_id, {
    location: data.location,
    scheduled_time: data.scheduled_time ? new Date(data.scheduled_time) : undefined,
    status: data.status,
    notes: data.notes,
  });
}

export async function deleteMeetup(user, id) {
  const meetup = await requireMeetup(id);
  ensureParticipantOrAdmin(user, meetup);
  await meetupRepo.remove(meetup.meetup_id);
}
