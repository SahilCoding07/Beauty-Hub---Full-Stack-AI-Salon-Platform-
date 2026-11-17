import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  adminId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'beauty_hub_fallback_jwt_secret_key_2026';
    const decoded = jwt.verify(header.split(' ')[1], secret) as { id: string };
    req.adminId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
