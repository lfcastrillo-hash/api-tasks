import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { AppError } from '../middleware/error.middleware';

/**
 * Registra un nuevo usuario en Supabase Auth.
 * Supabase envía un email de confirmación automáticamente.
 */
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw new AppError(400, error.message);

  res.status(201).json({
    success: true,
    message: 'Registro exitoso. Revisa tu email para confirmar la cuenta.',
    data: {
      id:    data.user?.id,
      email: data.user?.email,
    },
  });
};

/**
 * Autentica al usuario y devuelve el JWT de sesión.
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new AppError(401, 'Credenciales inválidas');

  res.json({
    success:    true,
    token:      data.session?.access_token,
    expires_in: data.session?.expires_in,
  });
};
