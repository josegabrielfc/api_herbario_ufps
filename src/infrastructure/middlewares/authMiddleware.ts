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
    // Limitación de tasa
    const ip = req.ip || '0.0.0.0'; // IP por defecto si no está definida
    const isRateLimited = await rateLimiter.consume(ip);
    
    if (!isRateLimited) {
      res.status(429).json({
        statusCode: 429,
        status: 'TOO_MANY_REQUESTS',
        message: 'Demasiadas solicitudes. Por favor, intenta más tarde.',
      });
      return;
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.error('Falta el encabezado de autorización', { ip });
      res.status(401).json({ 
        statusCode: 401,
        status: 'AUTH_HEADER_MISSING',
        message: 'Falta el encabezado de autorización',
      });
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      logger.error('Formato de autorización inválido', { ip });
      res.status(401).json({ 
        statusCode: 401,
        status: 'INVALID_AUTH_FORMAT',
        message: 'El formato de autorización es inválido. Usa: Bearer <token>'
      });
      return;
    }

    const token = parts[1];
    
    if (!token) {
      logger.error('Token no proporcionado', { ip });
      res.status(401).json({ 
        statusCode: 401,
        status: 'NO_TOKEN_PROVIDED',
        message: 'Token no proporcionado'
      });
      return;
    }

    try {
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'your-secret-key'
      ) as JwtPayload;

      req.user = decoded;
      next();
    } catch (jwtError) {
      logger.error('Falló la verificación del JWT', { ip, error: jwtError });
      res.status(401).json({
        statusCode: 401,
        status: 'INVALID_TOKEN',
        message: 'Token inválido'
      });
      return;
    }
  } catch (error) {
    logger.error('Error de autenticación', { error });
    res.status(500).json({
      statusCode: 500,
      status: 'INTERNAL_ERROR',
      message: 'Error interno del servidor'
    });
    return;
  }
};
