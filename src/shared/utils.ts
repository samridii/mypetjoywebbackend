import jwt, { SignOptions } from 'jsonwebtoken';
import env from '@/config/env';
import { ROLES } from './constants';

export interface JwtPayload {
  id: string;
  role: typeof ROLES[keyof typeof ROLES];
  email: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (
  payload: Omit<JwtPayload, 'iat' | 'exp'>
): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};