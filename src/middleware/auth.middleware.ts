import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';

/**
 * Middleware de autenticación JWT.
 * Extrae el token del header Authorization: Bearer <token>,
 * lo valida con Supabase Auth e inyecta el usuario en req.user.
 *
 * Express 5: funciona como async middleware sin try/catch.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Token de acceso requerido',
    });
    return;
  }

  const token = authHeader.slice(7); // eliminar 'Bearer '

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
    });
    return;
  }

  req.user = user; // usuario tipado disponible en el resto de middlewares/controllers
  next();
};
