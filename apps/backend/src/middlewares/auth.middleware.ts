import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  userId: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = header.slice('Bearer '.length);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET no está definida');
    return res.status(500).json({ error: 'Error interno del servidor' });
  }

  try {
    const payload = jwt.verify(token, secret) as AuthPayload;
    req.auth = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ error: 'No tienes permiso para esta acción' });
    }

    next();
  };
}