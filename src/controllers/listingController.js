import * as listingService from '../services/listingService.js';

export async function create(req, res) {
  res.status(201).json(await listingService.createListing(req.user, req.body));
}

export async function list(req, res) {
  res.status(200).json(await listingService.listListings(req.query));
}

export async function get(req, res) {
  res.status(200).json(await listingService.getListing(req.params.id));
}

export async function update(req, res) {
  const listing = await listingService.updateListing(req.user, req.params.id, req.body);
  res.status(200).json({ message: 'Listing updated successfully', listing });
}

export async function remove(req, res) {
  await listingService.deleteListing(req.user, req.params.id);
  res.status(200).json({ message: 'Listing deleted successfully' });
}
