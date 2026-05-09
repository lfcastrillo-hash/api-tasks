import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Factory que devuelve un middleware de validación para un schema Zod dado.
 * Si el body no es válido, responde 400 con los errores por campo.
 * Si es válido, reemplaza req.body con los datos parseados/saneados.
 */
export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    req.body = result.data; // datos limpios y con defaults aplicados
    next();
  };
