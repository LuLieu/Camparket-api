import ApiError from '../utils/ApiError.js';
import * as categoryRepo from '../repositories/categoryRepo.js';
import * as listingRepo from '../repositories/listingRepo.js';
import { serializeListing } from '../utils/formatters.js';

const conditions = ['new', 'like_new', 'good', 'fair', 'poor'];
const statuses = ['available', 'pending', 'sold', 'removed'];

function parseId(id) {
  const value = Number(id);
  if (!Number.isInteger(value) || value <= 0) throw new ApiError(400, 'Invalid ID format');
  return value;
}

async function requireListing(id) {
  const listing = await listingRepo.getById(parseId(id));
  if (!listing) throw new ApiError(404, 'Listing not found');
  return listing;
}

function ensureOwnerOrAdmin(user, listing) {
  if (user.role !== 'admin' && listing.seller_id !== user.user_id) {
    throw new ApiError(403, 'User not owner of listing');
  }
}

function validateListingPayload(data, partial = false) {
  const required = ['category_id', 'title', 'description', 'price', 'condition'];
  if (!partial) {
    for (const field of required) {
      if (data[field] === undefined || data[field] === '') throw new ApiError(400, `${field} is required`);
    }
  }
  if (data.price !== undefined && (Number.isNaN(Number(data.price)) || Number(data.price) < 0)) {
    throw new ApiError(400, 'price must be a positive number');
  }
  if (data.condition !== undefined && !conditions.includes(data.condition)) {
    throw new ApiError(400, 'condition is invalid');
  }
  if (data.status !== undefined && !statuses.includes(data.status)) {
    throw new ApiError(400, 'status is invalid');
  }
}

export async function createListing(user, data) {
  validateListingPayload(data);
  const category = await categoryRepo.getById(parseId(data.category_id));
  if (!category) throw new ApiError(404, 'Category not registered');

  const listing = await listingRepo.create({
    seller_id: user.user_id,
    category_id: category.category_id,
    title: data.title,
    description: data.description,
    price: Number(data.price),
    condition: data.condition,
    status: data.status || 'available',
    images: data.images?.length
      ? { create: data.images.map((image) => ({ image_url: image.image_url, alt_text: image.alt_text })) }
      : undefined,
  });
  return serializeListing(listing);
}

export async function listListings(query) {
  const where = {};
  if (query.status) {
    if (!statuses.includes(query.status)) throw new ApiError(400, 'Invalid status query parameter');
    where.status = query.status;
  }
  if (query.category_id) where.category_id = parseId(query.category_id);

  const listings = await listingRepo.getAll(where);
  return listings.map(serializeListing);
}

export async function getListing(id) {
  return serializeListing(await requireListing(id));
}

export async function updateListing(user, id, data) {
  const listing = await requireListing(id);
  ensureOwnerOrAdmin(user, listing);
  validateListingPayload(data, true);

  if (data.category_id) {
    const category = await categoryRepo.getById(parseId(data.category_id));
    if (!category) throw new ApiError(404, 'Category not registered');
  }

  const updated = await listingRepo.update(listing.listing_id, {
    category_id: data.category_id ? parseId(data.category_id) : undefined,
    title: data.title,
    description: data.description,
    price: data.price === undefined ? undefined : Number(data.price),
    condition: data.condition,
    status: data.status,
  });
  return serializeListing(updated);
}

export async function deleteListing(user, id) {
  const listing = await requireListing(id);
  ensureOwnerOrAdmin(user, listing);
  await listingRepo.remove(listing.listing_id);
}
