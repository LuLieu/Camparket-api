import * as meetupService from '../services/meetupService.js';

export async function create(req, res) {
  res.status(201).json(await meetupService.createMeetup(req.user, req.body));
}

export async function list(req, res) {
  res.status(200).json(await meetupService.listMeetups(req.user));
}

export async function get(req, res) {
  res.status(200).json(await meetupService.getMeetup(req.user, req.params.id));
}

export async function update(req, res) {
  const meetup = await meetupService.updateMeetup(req.user, req.params.id, req.body);
  res.status(200).json({ message: 'Meetup updated successfully', meetup });
}

export async function remove(req, res) {
  await meetupService.deleteMeetup(req.user, req.params.id);
  res.status(200).json({ message: 'Meetup deleted successfully' });
}
