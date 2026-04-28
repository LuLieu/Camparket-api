import ApiError from '../utils/ApiError.js';
import * as listingRepo from '../repositories/listingRepo.js';
import * as messageRepo from '../repositories/messageRepo.js';
import { getUserById } from '../repositories/userRepo.js';

function parseId(id) {
  const value = Number(id);
  if (!Number.isInteger(value) || value <= 0) throw new ApiError(400, 'Invalid ID format');
  return value;
}

async function requireMessage(id) {
  const message = await messageRepo.getById(parseId(id));
  if (!message) throw new ApiError(404, 'Message not found');
  return message;
}

function ensureParticipantOrAdmin(user, message) {
  if (user.role !== 'admin' && message.sender_id !== user.user_id && message.receiver_id !== user.user_id) {
    throw new ApiError(403, 'User not associated with message');
  }
}

export async function createMessage(user, data) {
  if (!data.listing_id || !data.content?.trim()) {
    throw new ApiError(400, 'listing_id and content are required');
  }

  const listing = await listingRepo.getById(parseId(data.listing_id));
  if (!listing) throw new ApiError(404, 'Listing not found');

  const receiverId = data.receiver_id ? parseId(data.receiver_id) : listing.seller_id;
  const receiver = await getUserById(receiverId);
  if (!receiver) throw new ApiError(404, 'Recipient not found');
  if (receiver.user_id === user.user_id) throw new ApiError(400, 'Cannot message yourself');

  return messageRepo.create({
    listing_id: listing.listing_id,
    sender_id: user.user_id,
    receiver_id: receiver.user_id,
    content: data.content.trim(),
    is_read: Boolean(data.is_read),
  });
}

export async function listMessages(user) {
  const where = user.role === 'admin'
    ? {}
    : { OR: [{ sender_id: user.user_id }, { receiver_id: user.user_id }] };

  return messageRepo.getAll(where);
}

export async function getMessage(user, id) {
  const message = await requireMessage(id);
  ensureParticipantOrAdmin(user, message);
  return message;
}

export async function updateMessage(user, id, data) {
  const message = await requireMessage(id);
  ensureParticipantOrAdmin(user, message);

  if (data.content === undefined && data.is_read === undefined) {
    throw new ApiError(400, 'content or is_read is required');
  }
  if (data.content !== undefined && !data.content.trim()) {
    throw new ApiError(400, 'content cannot be empty');
  }
  if (data.content !== undefined && user.role !== 'admin' && message.sender_id !== user.user_id) {
    throw new ApiError(403, 'Only the sender can edit message content');
  }
  if (data.is_read !== undefined && typeof data.is_read !== 'boolean') {
    throw new ApiError(400, 'is_read must be a boolean');
  }

  return messageRepo.update(message.message_id, {
    content: data.content?.trim(),
    is_read: data.is_read,
  });
}

export async function deleteMessage(user, id) {
  const message = await requireMessage(id);
  ensureParticipantOrAdmin(user, message);
  await messageRepo.remove(message.message_id);
}
