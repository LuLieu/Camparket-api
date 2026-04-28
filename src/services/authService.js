import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import { createUser, getUserByEmail, getUserByUsernameOrEmail } from '../repositories/userRepo.js';
import { serializeUser } from '../utils/formatters.js';

const charlotteEmailPattern = /^[^\s@]+@charlotte\.edu$/i;

function signToken(user) {
  return jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' },
  );
}

export async function signup({ username, email, password }) {
  if (!username || !email || !password) {
    throw new ApiError(400, 'username, email, and password are required');
  }

  if (!charlotteEmailPattern.test(email)) {
    throw new ApiError(403, 'Email must be a charlotte.edu address');
  }

  const existing = await getUserByUsernameOrEmail(username, email.toLowerCase());

  if (existing) {
    throw new ApiError(409, 'Username or email already in use');
  }

  const user = await createUser({
    username,
    email: email.toLowerCase(),
    password_hash: await bcrypt.hash(password, 10),
    role: 'student',
  });

  return serializeUser(user);
}

export async function login({ email, password }) {
  if (!email || !password) {
    throw new ApiError(400, 'email and password are required');
  }

  const user = await getUserByEmail(email.toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  return {
    token: signToken(user),
    user: {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    },
  };
}
