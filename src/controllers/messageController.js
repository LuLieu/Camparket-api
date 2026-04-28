import * as messageService from '../services/messageService.js';

export async function create(req, res) {
  res.status(201).json(await messageService.createMessage(req.user, req.body));
}

export async function list(req, res) {
  res.status(200).json(await messageService.listMessages(req.user));
}

export async function get(req, res) {
  res.status(200).json(await messageService.getMessage(req.user, req.params.id));
}

export async function update(req, res) {
  const updatedMessage = await messageService.updateMessage(req.user, req.params.id, req.body);
  res.status(200).json({ message: 'Message updated successfully', updated_message: updatedMessage });
}

export async function remove(req, res) {
  await messageService.deleteMessage(req.user, req.params.id);
  res.status(200).json({ message: 'Message deleted successfully' });
}
