import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { createLogger, format, transports } from 'winston';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl';

const userRepository: UserRepository = new UserRepositoryImpl();

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
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        roleId: number;
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const response = {
    statusCode: 401,
    message: 'No autorizado',
    timestamp: new Date().toISOString(),
    data: null
  };

  try {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Intento de acceso sin token', { path: req.path, ip: req.ip });
      return res.status(401).json(response);
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar y decodificar el token JWT
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'tu-secreto-seguro'
    ) as JwtPayload;

    // Verificar que el usuario exista en la base de datos
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      logger.warn('Usuario no encontrado', { userId: decoded.userId });
      return res.status(401).json(response);
    }

    // Verificar que el token coincida con el almacenado en la base de datos
    if (user.token !== token) {
      logger.warn('Token no coincide con el almacenado', { userId: decoded.userId });
      return res.status(401).json(response);
    }

    // Verificar si el token ha expirado
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      logger.warn('Token expirado', { userId: decoded.userId });
      response.message = 'Token expirado';
      return res.status(401).json(response);
    }

    // Adjuntar información del usuario a la solicitud
    req.user = {
      userId: user.id,
      roleId: user.role_id
    };

    // Registrar acceso exitoso
    logger.info('Acceso autorizado', { userId: user.id, path: req.path });
    
    next();
  } catch (error) {
    logger.error('Error en autenticación', { error: error, path: req.path });
    
    if (error instanceof jwt.TokenExpiredError) {
      response.message = 'Token expirado';
      return res.status(401).json(response);
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      response.message = 'Token inválido';
      return res.status(401).json(response);
    }
    
    response.message = 'Error de autenticación';
    response.statusCode = 500;
    return res.status(500).json(response);
  }
};

// v2
/*
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { createLogger, format, transports } from 'winston';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl';

const userRepository: UserRepository = new UserRepositoryImpl();

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
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        roleId: number;
      };
    }
  }
}*/

export const authMiddleware2 = (req: Request, res: Response, next: NextFunction) => {
  const response = {
    statusCode: 401,
    message: 'No autorizado',
    timestamp: new Date().toISOString(),
    data: null
  };

  const auth = async () => {
    try {
      // Obtener el token del encabezado de autorización
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn('Intento de acceso sin token', { path: req.path, ip: req.ip });
        return res.status(401).json(response);
      }

      const token = authHeader.split(' ')[1];
      
      // Verificar y decodificar el token JWT
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'tu-secreto-seguro'
      ) as JwtPayload;

      // Verificar que el usuario exista en la base de datos
      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        logger.warn('Usuario no encontrado', { userId: decoded.userId });
        return res.status(401).json(response);
      }

      // Verificar que el token coincida con el almacenado en la base de datos
      if (user.token !== token) {
        logger.warn('Token no coincide con el almacenado', { userId: decoded.userId });
        return res.status(401).json(response);
      }

      // Verificar si el token ha expirado
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        logger.warn('Token expirado', { userId: decoded.userId });
        response.message = 'Token expirado';
        return res.status(401).json(response);
      }

      // Adjuntar información del usuario a la solicitud
      req.user = {
        userId: user.id,
        roleId: user.role_id
      };

      // Registrar acceso exitoso
      logger.info('Acceso autorizado', { userId: user.id, path: req.path });
      
      next();
    } catch (error) {
      logger.error('Error en autenticación', { error: error, path: req.path });
      
      if (error instanceof jwt.TokenExpiredError) {
        response.message = 'Token expirado';
        return res.status(401).json(response);
      }
      
      if (error instanceof jwt.JsonWebTokenError) {
        response.message = 'Token inválido';
        return res.status(401).json(response);
      }
      
      response.message = 'Error de autenticación';
      response.statusCode = 500;
      return res.status(500).json(response);
    }
  };

  auth();
};