import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export const generateToken = (user: User): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
  };

  return jwt.sign(payload, jwtSecret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.verify(token, jwtSecret) as JwtPayload;
};