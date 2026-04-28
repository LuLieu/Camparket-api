import * as authService from '../services/authService.js';

export async function signup(req, res) {
  const user = await authService.signup(req.body);
  res.status(201).json({ message: 'User account created successfully', user });
}

export async function login(req, res) {
  res.status(200).json(await authService.login(req.body));
}
