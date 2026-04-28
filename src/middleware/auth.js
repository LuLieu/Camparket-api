import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import { getUserById } from '../repositories/userRepo.js';

export async function authenticate(req, _res, next) {
  try {
    const header = req.get('authorization');
    if (!header?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication token required');
    }

    const token = header.slice('Bearer '.length);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(payload.user_id);

    if (!user) {
      throw new ApiError(401, 'Authentication token is invalid');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.name === 'JsonWebTokenError' ? new ApiError(401, 'Authentication token is invalid') : error);
  }
}

export function requireAdmin(req, _res, next) {
  if (req.user?.role !== 'admin') {
    return next(new ApiError(403, 'Admin role required'));
  }
  next();
}
