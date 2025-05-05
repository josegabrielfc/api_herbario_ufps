import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { createLogger, format, transports } from 'winston';

// Configuración del logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

// Configuración del rate limiter
const rateLimiter = new RateLimiterMemory({
  points: 5, // Máximo 5 intentos
  duration: 1, // en minutos
});

interface JwtPayload {
  userId: number;
  roleId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Rate limiting
    const ip = req.ip || '0.0.0.0'; // Provide a default IP if undefined
    const isRateLimited = await rateLimiter.consume(ip);
    
    if (!isRateLimited) {
      res.status(429).json({
        message: 'Too many requests. Please try again later.'
      });
      return;
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.error('Authorization header missing', { ip });
      res.status(401).json({ 
        message: 'Authorization header is missing',
        code: 'AUTH_HEADER_MISSING'
      });
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      logger.error('Invalid authorization format', { ip });
      res.status(401).json({ 
        message: 'Authorization format is invalid. Use: Bearer <token>',
        code: 'INVALID_AUTH_FORMAT'
      });
      return;
    }

    const token = parts[1];
    
    if (!token) {
      logger.error('No token provided', { ip });
        res.status(401).json({ 
        message: 'No token provided',
        code: 'NO_TOKEN_PROVIDED'
      });
      return;
    }

    try {
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'your-secret-key'
      ) as JwtPayload;

      // Verificar si el token está en la lista negra
      const isTokenBlacklisted = await checkTokenBlacklist(token);
      if (isTokenBlacklisted) {
        logger.error('Token is blacklisted', { ip });
        res.status(401).json({
          message: 'Token has been revoked',
          code: 'TOKEN_REVOKED'
        });
        return;
      }

      req.user = decoded;
      next();
    } catch (jwtError) {
      logger.error('JWT verification failed', { ip, error: jwtError });
      res.status(401).json({
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
      return;
    }
  } catch (error) {
    logger.error('Authentication error', { error });
    res.status(500).json({
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
    return;
  }
};

// Función para verificar si un token está en la lista negra
async function checkTokenBlacklist(token: string): Promise<boolean> {
  // Implementar lógica para verificar la lista negra
  // Puede ser una base de datos o una caché
  return false;
}